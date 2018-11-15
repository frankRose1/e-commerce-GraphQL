import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Head from 'next/head';
import AddToCart from './AddToCart';
import DeleteItem from './DeleteItem';
import Error from './ErrorMessage';
import Loading from './Loading';
import formatMoney from '../lib/formatMoney';
import ItemProfileStyles from './styles/ItemProfileStyles';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      largeImage
      title
      description
      price
    }
  }
`;

class ItemProfile extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ data, error, loading }) => {
          const { item } = data;
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;
          if (!item) return <p>No item found!</p>;

          return (
            <ItemProfileStyles>
              <Head>
                <title>BackPackzz | {item.title}</title>
              </Head>
              <h3 className='price'>{formatMoney(item.price)}</h3>
              <img src={item.largeImage} alt={item.title} />
              <div className='details'>
                <h2>{item.title}</h2>
                <p>{item.description}</p>

                <div className='item-buttons'>
                  <Link
                    href={{
                      pathname: '/update',
                      query: { id: this.props.id }
                    }}
                  >
                    <a>Edit</a>
                  </Link>
                  <AddToCart itemId={this.props.id} />
                  <DeleteItem id={this.props.id} />
                </div>
              </div>
            </ItemProfileStyles>
          );
        }}
      </Query>
    );
  }
}

export default ItemProfile;
export { SINGLE_ITEM_QUERY };
