import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($itemId: ID!){
    addToCart(itemId: $itemId){
      id
      quantity
    }
  }
`;

class AddToCart extends Component {

  static propTypes = {
    itemId: PropTypes.string.isRequired
  }

  render() {
    const {itemId} = this.props;
    return (
      <Mutation 
        mutation={ADD_TO_CART_MUTATION}
        variables={{
          itemId
        }}
        refetchQueries={[
          {query: CURRENT_USER_QUERY}
        ]}>
        {(addToCart, {loading, error}) => (
          <button 
            disabled={loading}
            onClick={addToCart}>
            Add{loading ? 'ing' : ''} To Cart
          </button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
export { ADD_TO_CART_MUTATION };