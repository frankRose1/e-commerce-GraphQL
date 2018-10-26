import Link from 'next/link';
import React from 'react';
import {Mutation} from 'react-apollo';
import StyledNav from './styles/NavStyles';
import SignOut from './SignOut';
import User from './User';
import CartCount from './CartCount';
import {TOGGLE_CART_MUTATION} from './Cart';


const Nav = () => (
  <User>
    {( {data: {me} }) => (
      <StyledNav data-test="nav">
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
            <a>Orders</a>
            </Link>
            <Link href="/account">
              <a>Account</a>
            </Link>
            <SignOut />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <button onClick={toggleCart}>
                  My Cart
                  <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)} />
                </button>
              )}
            </Mutation>
          </>
        )}
        {!me && (
          <Link href="/signin">
            <a>Sign In</a>
          </Link>
        )}
      </StyledNav>
    )}
  </User>
);

export default Nav;
