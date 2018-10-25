import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

//TODO: remove alerts for a popup here, and on delete item button

const BigButton = styled.button`
  font-size: 5rem;
  padding: 1.5rem;
  background: none;
  border: 0;
  outline: none;
  transition: color 0.4s ease-in-out;
  cursor: pointer;
  &:hover{
    color: ${props => props.theme.red}
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_CART_ITEM_MUTATION($cartItemId: ID!){
    removeFromCart(cartItemId: $cartItemId){
      id
    }
  }
`;

class RemoveFromCart extends Component {

  //When an item is removed, delete it from the cache as it takes a second to display in the UI when fetching to the DB
  //this is called after a response is recieved from the server after running a mutation
  //payload is the data requested in the mutation (only asked for cart item ID)
  updateCache = (cache, payload) => {
    const data = cache.readQuery({
      query: CURRENT_USER_QUERY
    });
    const id = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(item => item.id !== id);
    cache.writeQuery({query: CURRENT_USER_QUERY, data});
  }

  render() {
    const {cartItemId} = this.props;
    //the optmistic repsonse will run immediately so that the UI can be updated quicker, while in the background the item is still being removed in the DB
    return (
      <Mutation 
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ cartItemId }}
        update={this.updateCache}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: cartItemId
          }
        }}>
        {(removeFromCart, {error, loading}) => (
          <BigButton
            disabled={loading}
            title="Remove Item"
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}>
              &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

RemoveFromCart.propTypes = {
  cartItemId: PropTypes.string.isRequired
}

export default RemoveFromCart;