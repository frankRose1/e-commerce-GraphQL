import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  display: grid;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  grid-template-columns: auto 1fr auto;
  align-items: center;
  img {
    width: 100px;
    margin-right: 10px;
  }
  h3, p {
    margin: 0;
  }
`;

const DeletedItem = styled.li`
  padding: 1rem 0;
  display: grid;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  grid-template-columns: 1fr auto;
  align-items: center;
`;

const CartItem = ({cartItem: { item, quantity, id} }) => {
  //in the case that An item is deleted in the DB we dont want to show it in the users cart
  if (!item){
    return (
      <DeletedItem>
        <p>Sorry, this item is no longer sold in our store!</p>
        <RemoveFromCart cartItemId={id}/>
      </DeletedItem>
    )
  }

  return (
  <CartItemStyles>
    <img src={item.image} alt={item.title}/>
    <div className="cart-item-details">
      <h3>{item.title}</h3>
      <p>
        {formatMoney(item.price * quantity)}
        {' - '}
        <em>{quantity} &times; {formatMoney(item.price)} each</em>
      </p>
    </div>
    <RemoveFromCart cartItemId={id}/>
  </CartItemStyles>
)};

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    item: PropTypes.object
  }).isRequired
};

export default CartItem;