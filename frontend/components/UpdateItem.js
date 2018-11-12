import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import Loading from './Loading';
import SubTitle from './styles/SubTitleStyles';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleSubmit = async (e, mutation) => {
    e.preventDefault();
    const res = await mutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id }
    });
  };

  handleInputChange = e => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <Loading />;
          if (!data.item)
            return <p>No item found with the ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { error, loading }) => (
                <>
                  <SubTitle>Update Item</SubTitle>
                  <Form
                    data-test='update-item'
                    method='post'
                    onSubmit={e => this.handleSubmit(e, updateItem)}
                  >
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                      <label htmlFor='title'>
                        Title
                        <input
                          type='text'
                          id='title'
                          name='title'
                          placeholder='Title'
                          defaultValue={data.item.title}
                          onChange={this.handleInputChange}
                          required
                        />
                      </label>

                      <label htmlFor='price'>
                        Price
                        <input
                          type='number'
                          id='price'
                          name='price'
                          placeholder='Price'
                          defaultValue={data.item.price}
                          onChange={this.handleInputChange}
                          required
                        />
                      </label>

                      <label htmlFor='description'>
                        Description
                        <textarea
                          type='text'
                          id='description'
                          name='description'
                          placeholder='Enter a description'
                          defaultValue={data.item.description}
                          onChange={this.handleInputChange}
                          required
                        />
                      </label>

                      <button type='submit'>
                        Sav{loading ? 'ing' : 'e'} Changes
                      </button>
                    </fieldset>
                  </Form>
                </>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION, SINGLE_ITEM_QUERY };
