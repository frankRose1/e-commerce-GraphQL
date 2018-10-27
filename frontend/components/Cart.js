import React from 'react';
import {Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
import {adopt} from 'react-adopt';
import User from './User';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import Button from './styles/SickButton';
import PurchaseItem from './PurchaseItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

//Client side query & mutation for cart boolean
const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Composed = adopt({
  user: ({render}) => <User>{render}</User>,
  toggleCart: ({render}) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({render}) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => {
  return (
    <Composed>
      {( {user, toggleCart, localState} ) => {
        const {data: {me}, loading} = user;
        if (loading) return <p>Loading...</p>
        if(!me) return null //dont show the cart if user is not signed in
        return (
          <CartStyles
            data-test="cart"
            open={localState.data.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>{me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart</p>
            </header>

              <ul>
                {me.cart.map(cartItem => (
                  <CartItem 
                    key={cartItem.id}
                    cartItem={cartItem}/>
                ))}
              </ul>

            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              {me.cart.length
                ? (
                  <PurchaseItem>
                    <Button>Checkout</Button>
                  </PurchaseItem>
                )
              : null }
            </footer>
          </CartStyles>
        )
      }}
    </Composed>
  );
};

export default Cart;
export {TOGGLE_CART_MUTATION, LOCAL_STATE_QUERY};