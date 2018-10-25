/**
 * Each request exposes 4 main variables
 * parent - the parent schema
 * ctx - surfaces the DB and the rest of the request(headers, cookies etc)
 * args - arguments passed to the query/mutation(e.g. creating an item {title: "new item", price: 1000})
 * info - information returned from the query/mutation
 */

//if the queries in yoga are the same as the prisma API you can forward them to prisma
// this is if there is not extra logic that needs to happen for the query
const {forwardTo} = require('prisma-binding'); 
const {requiresLogin, hasPermission} = require('../utils.js');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, ctx, info){
    //check to see if there is a current User, if not return null so we know that someone isnt logged in
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  async usersPermissions(parent, args, ctx, info){
    requiresLogin(ctx.request);
    //only certain users may use this query
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info){
    requiresLogin(ctx.request);
    const order = await ctx.db.query.order({where: {id: args.orderId} }, info);
    //only the owner or an admin can see the order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermission) throw new Error('You are not allowed to see this order!');
    return order;
  },
  async userOrders(parent, args, ctx, info){
    requiresLogin(ctx.request);
    return ctx.db.query.orders({
      where: {
        user: { id: ctx.request.userId }
      }
    }, info);
  }
};

module.exports = Query;
