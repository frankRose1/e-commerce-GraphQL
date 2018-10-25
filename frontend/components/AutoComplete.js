import React, { Component } from 'react';
import {ApolloConsumer} from 'react-apollo'; //run queries on demand
import gql from 'graphql-tag';
import Router from 'next/router';
import debounce from 'lodash.debounce';
import Downshift, {resetIdCounter} from 'downshift';
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown';

function routeToItem(item){
  Router.push({
    pathname: '/item',
    query: { id: item.id }
  })
}

//serach by either the title or description
const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!){
    items(where: {
      OR: [
        { title_contains: $searchTerm},
        { description_contains: $searchTerm}
      ]
    }){
      id
      image
      title
    }
  }
`;

class AutoComplete extends Component {

  state= {
    loading: false,
    items: []
  }

  //Manually fire off a query on input change
  handleChange = debounce(async (e, {query}) => {
    this.setState({loading: true});
    const res = await query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    });
    this.setState({
      loading: false,
      items: res.data.items
    })
  }, 400);

  render() {
    const {items, loading} = this.state;
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={item => (item === null ? '' : item.title)}>
          { ({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex}) => (
          <div>
            <ApolloConsumer>
              { client => (
                <input
                  {...getInputProps({
                    placeholder: "Search Our Awesome Collection",
                    type: "search",
                    id: 'search',
                    className: this.state.loading ? 'loading' : '',
                    onChange: e => {
                      e.persist();
                      this.handleChange(e, client);
                    }
                  })} />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.map((item, i) => (
                  <DropDownItem
                    {...getItemProps({item})}
                    highlighted={highlightedIndex === i}
                    key={item.id}>
                    <img width="50" src={item.image} alt={item.title}/>
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem>
                    Nothing found for "{inputValue}"
                  </DropDownItem>
                )}
              </DropDown>
            )}
          </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;