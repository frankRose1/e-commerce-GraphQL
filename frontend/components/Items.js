import React, { Component } from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import {perPage} from '../config';
import SubTitle from './styles/SubTitleStyles';
import Loading from './Loading';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(skip: $skip, first: $first,  orderBy: createdAt_DESC) {
      title
      price
      image
      largeImage
      description
      id
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: ${props => props.theme.maxWidth};
  grid-gap: 60px;
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    const {page} = this.props;
    return (
      <Center>
        <SubTitle>Shop</SubTitle>
        <Pagination page={page} />
        <Query 
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: (page * perPage) - perPage
          }}>
        {({data, loading, error}) => {
          if (loading) return <Loading />
          if (error) return <p>Error: {error.message}</p>

          return (
            <ItemsList data-test="all-items">
              {data.items.map(item => (
                <Item
                  key={item.id}
                  item={item} />
              ))}
          </ItemsList>
          )
        }}
      </Query>
      <Pagination page={page} />
    </Center>
    );
  }
}

export default Items;
export {ALL_ITEMS_QUERY};