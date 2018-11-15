const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const {
  requiresLogin,
  hasPermission,
  ownsItemOrPermission
} = require('../utils');
const { transport, makeANiceEmail } = require('../mail');
const stripe = require('../stripe');
const cookieConfig = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 365 //one year
};

const Mutations = {
  async createItem(parent, args, ctx, info) {
    requiresLogin(ctx.request);

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          user: {
            connect: {
              id: ctx.request.userId
            }
          }
        }
      },
      info
    );

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    requiresLogin(ctx.request);
    const updates = { ...args };
    delete updates.id;
    const where = { id: args.id };
    const item = await ctx.db.query.item(
      { where },
      `{
      id
      user {
        id
      }
    }`
    );
    ownsItemOrPermission(item, ctx.request.user, ['ADMIN', 'ITEMUPDATE']);
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item(
      { where },
      `{
      id
      user {
        id
      }
    }`
    );
    ownsItemOrPermission(item, ctx.request.user, ['ADMIN', 'ITEMDELETE']);
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const existingUser = await ctx.db.query.user(
      { where: { email: args.email } },
      `{id}`
    );
    if (existingUser) {
      throw new Error('A user with that email already exists!');
    }
    if (args.password !== args.confirmPassword) {
      throw new Error('Passwords must match!');
    }

    const password = await bcrypt.hash(args.password, 10);
    //create the user. since permissions type is an enum we must use "set"
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          password,
          email: args.email,
          name: args.name,
          permissions: { set: ['USER'] }
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, cookieConfig);
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user(
      { where: { email } },
      `{ id password}`
    );
    if (!user) {
      throw new Error(
        'There is no account associated with that email address!'
      );
    }

    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('That password is incorrect!');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, cookieConfig);
    return user;
  },
  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Successfully logged out.' };
  },
  async requestReset(parent, { email }, ctx, info) {
    //1 Check if its a real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(
        'There is no account associated with that email address!'
      );
    }
    //2 set a token and expiry on the user
    const randomBytyesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytyesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });
    //3 Send the user an email
    const emailRes = await transport.sendMail({
      from: '@noreply<backpackz.com>',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your password reset token is here! \n\n
        <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to reset</a>`)
    });
    return {
      message:
        'You have been sent an email with instructions on resetting your password.'
    };
  },
  async resetPassword(
    parent,
    { password, confirmPassword, resetToken },
    ctx,
    info
  ) {
    if (password !== confirmPassword) {
      throw new Error('Passwords must match!');
    }
    //find a user who has the reseToken and that its not expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error('This reset token is either invalid or has expired!');
    }

    const newPassword = await bcrypt.hash(password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, cookieConfig);

    return { message: 'The password reset was a success!' };
  },
  async updateUserPermissions(parent, args, ctx, info) {
    requiresLogin(ctx.request);
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        where: {
          id: args.userId
        },
        data: {
          permissions: {
            set: args.permissions
          }
        }
      },
      info
    );
  },
  async addToCart(parent, { itemId }, ctx, info) {
    requiresLogin(ctx.request);
    const { userId } = ctx.request;
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: itemId }
      }
    });
    //if it exists, increment it by one
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }
    // if it doesnt exist create a cart item referencing the user and the item
    //cart item is really just a pointer at who has the item and the item it is referencing
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: { id: itemId }
          }
        }
      },
      info
    );
  },
  async removeFromCart(parent, args, ctx, info) {
    const { request } = ctx;
    requiresLogin(request);
    //find item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: { id: args.cartItemId }
      },
      `{ id user {id} }`
    );
    if (!cartItem) throw new Error('No item found!');
    //see if user owns it
    const ownsItem = request.userId === cartItem.user.id;
    if (!ownsItem) {
      throw new Error("You don't have permission to remove that item!");
    }
    //remove it from cart
    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: cartItem.id }
      },
      info
    );
  },
  async createOrder(parent, args, ctx, info) {
    requiresLogin(ctx.request);
    const user = await ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      `{
      id
      email
      name
      cart {
        id
        quantity
        item {id title price description image largeImage}
      }
    }`
    );
    //recalculate total price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.quantity * cartItem.item.price,
      0
    );
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token
    });
    //create an array of orderItems, needs to cement the values of an actual item incase the item were to change or be deleted in the future
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: user.id } }
      };
      delete orderItem.id;
      return orderItem;
    });
    //create the order and the orderItems in one go
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: user.id } }
      }
    });
    //delete the cart items from the DB in bulk
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: { id_in: cartItemIds }
    });
    return order;
  }
};

module.exports = Mutations;
