import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import Head from 'next/head';
import gql from 'graphql-tag';
import { format } from 'date-fns';
import formatMoney from '../lib/formatMoney';
import OrderStyles from './styles/OrderStyles';
import Loading from './Loading';
import SubTitle from './styles/SubTitleStyles';
import Error from './ErrorMessage';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($orderId: ID!) {
    order(orderId: $orderId) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        image
        quantity
        price
      }
    }
  }
`;

class Order extends Component {
  static propTypes = {
    orderId: PropTypes.string.isRequired
  };

  render() {
    const { orderId } = this.props;

    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ orderId }}>
        {({ data, loading, error }) => {
          const { order } = data;
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;
          if (!order)
            return <p>No order found with the Id "{this.props.orderId}"</p>;

          return (
            <>
              <SubTitle>Viewing Order</SubTitle>
              <OrderStyles data-test='order'>
                <Head>
                  <title>BackPackz - Order {order.id}</title>
                </Head>
                <p>
                  <span>Order ID:</span>
                  <span data-test='order-id'>{order.id}</span>
                </p>
                <p>
                  <span>Charge:</span>
                  <span data-test='order-charge'>{order.charge}</span>
                </p>
                <p>
                  <span>Date:</span>
                  <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
                </p>
                <p>
                  <span>Order Total</span>
                  <span data-test='order-total'>
                    {formatMoney(order.total)}
                  </span>
                </p>
                <p>
                  <span>Item Count:</span>
                  <span>{order.items.length}</span>
                </p>
                <div className='items'>
                  {order.items.map(item => (
                    <div key={item.id} className='order-item'>
                      <img src={item.image} alt={item.title} />
                      <div className='item-details'>
                        <h2>{item.title}</h2>
                        <p>Qty: {item.quantity}</p>
                        <p>Each: {formatMoney(item.price)}</p>
                        <p>
                          SubTotal: {formatMoney(item.price * item.quantity)}
                        </p>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </OrderStyles>
            </>
          );
        }}
      </Query>
    );
  }
}

export default Order;
export { SINGLE_ORDER_QUERY };
