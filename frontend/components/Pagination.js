import React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {perPage} from '../config';
import Head from 'next/head';
import Link from 'next/link';
import Error from './ErrorMessage';
import PropTypes from 'prop-types';
import PaginationStyles from './styles/PaginationStyles';

//prefetch will fetch the next or prev page in production mode making rendering pages much faster

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection{
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({page}) => (
  <Query
    query={PAGINATION_QUERY}>
    {({data, loading, error}) => {
      if (loading) return <p>Loading...</p>
      if (error) return <Error error={error}/>
      
      const {count} = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);
      return (
        <PaginationStyles>
          <Head>
            <title>Back Packzz | Page {page} of {pages}</title>
          </Head>
          <Link
            prefetch
            href={{
            pathname: '/items',
            query: {page: page - 1}
          }}>
            <a className="prev" aria-disabled={ page <= 1}>Prev</a>
          </Link>
          <p>Page {page} of {pages}</p>
          <p>{count} total items</p>
          <Link
            prefetch
            href={{
            pathname: '/items',
            query: {page: page + 1}
          }}>
            <a className="next" aria-disabled={ page >= pages}>Next</a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
);

Pagination.propTypes = {
  page: PropTypes.number
}

export default Pagination;
export {PAGINATION_QUERY};