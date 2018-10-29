import React, { Component } from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
import Error from './ErrorMessage';
import Loading from './Loading';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  .details{
    text-align: center;
    font-size: 2rem;
    margin: 3rem;
    h2{
      text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
      text-transform: capitalize;
      &:after{
        content: "";
        display: block;
        width: 80%;
        margin: 1rem auto;
        height: 2px;
        background-color: ${props => props.theme.black};

      }
    }
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!){
    item( where: {id: $id} ){
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
        }}>
        { ( {data, error, loading} ) => {
          const {item} = data;
          if(loading) return <Loading />
          if(error) return <Error error={error}/>
          if(!item) return <p>No item found!</p>
          
          return (
            <SingleItemStyles>
              <Head>
                <title>Back Packzz | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title}/>
              <div className="details">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    );
  }
}

export default ItemProfile;
export {SINGLE_ITEM_QUERY}