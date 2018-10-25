import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {ALL_ITEMS_QUERY} from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!){
    deleteItem(id: $id){
      id
    }
  }
`;

class DeleteItem extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired
  };

  //maually update the cache so that it matches the data on the server. and updating cache will update the UI
  updateCache = (cache, payload) => {
    //read the cache for the items. we need to do this wit the query used to fetch the items in the first place
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // remove the deleted ID from cache
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    //put the items back
    cache.writeQuery({query: ALL_ITEMS_QUERY, data});
  }

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{
          id: this.props.id
        }}
        update={this.updateCache}>
        {(deleteItem, {error, loading}) => (
          <button
          disabled={loading}
          onClick={() => {
            if (confirm('Are you sure you want to delete this item?')){
              deleteItem().catch(err => {
                alert(err.message);
              });
            }
          }}>
            Delete This Item
          </button>
        )}
      </Mutation>
    );
  }
}



export default DeleteItem;