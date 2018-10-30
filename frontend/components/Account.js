import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {formatDistance} from 'date-fns';
import styled from 'styled-components';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import OrderItem from './styles/OrderItemStyles';
import Error from './ErrorMessage';
import Loading from './Loading';
import SubTitle from './styles/SubTitleStyles';

const OrdersGrid = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    userOrders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        quantity
        description
        title
        price
        image
      }
    }
  }
`;

class Account extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({data, loading, error}) => {
          const {userOrders} = data;
          if (loading) return <Loading />
          if(error) return <Error error={error} />
          if (!userOrders.length) return <p>Looks like you havn't ordered anything yet!</p>
          
          return (
            <div>
              <SubTitle>Your Account</SubTitle>
              <h2>You have {userOrders.length} order{userOrders.length === 1 ? '' : 's'}</h2>
              <OrdersGrid>
                {userOrders.map(order => (
                  <OrderItem key={order.id}>
                    <Link href={{
                      pathname: '/order',
                      query: { orderId: order.id }
                    }}>
                      <a>
                        <div className="order-meta">
                          <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                          <p>{order.items.length} Product{order.items.length === 1 ? '' : 's'}</p>
                          <p>{formatDistance(order.createdAt, new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              key={item.id} />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItem>
                ))}
            </OrdersGrid>
            </div>
          )
        }}
      </Query>
    );
  }
}

export default Account;