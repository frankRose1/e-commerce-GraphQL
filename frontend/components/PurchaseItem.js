import React, { Component } from 'react';
import {Mutation} from 'react-apollo'; //run queries on demand
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import NProgress from 'nprogress';
import Router from 'next/router';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, {CURRENT_USER_QUERY} from './User'; //refetching the current user after order is placed so we can refresh the cart

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!){
    createOrder(token: $token){
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart){
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class PurchaseItem extends Component {

  //the token ID is a one time token that will be sent to the server and allows us to charge the users card
  onToken = async ({id}, mutation) => {
    const res = await mutation({
      variables: { token: id }
    }).catch(err => alert(err.message));
    //route to order page
    Router.push({
      pathname: '/order',
      query: { orderId: res.data.createOrder.id }
    });
  }

  render() {
    return (
      <User>
        {( {data: {me}, loading }) =>  {
          if (loading) return null
          return (
            <Mutation 
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[ {query: CURRENT_USER_QUERY} ]}>
              { createOrder => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="BackPackzz"
                description={`Order of ${totalItems(me.cart)} items`}
                image={ me.cart.length && me.cart[0].item && me.cart[0].item.image }
                stripeKey="pk_test_mYMZiPiCtkHG2UrPgd9OUt2S"
                currency="USD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}>
                {this.props.children}
              </StripeCheckout>
              )}
            </Mutation>
        )}}
      </User>
    );
  }
}


export default PurchaseItem;