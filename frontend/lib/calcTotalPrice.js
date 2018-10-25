/**
 * Take in a users cart and return the total cost of all items in cart
 * @param {array} cart - array of cartItems which contain data about a specific item in the DB
 * @return {integer} totalPrice - total of cart items
 */
function calcTotalPrice(cart){
  return cart.reduce((tally, cartItem) => {
    //in the case an item is deleted from the DB the cartItem will have an ID that points to a deleted item
    if (!cartItem.item) return tally;
    return tally + (cartItem.quantity * cartItem.item.price);
  }, 0);
}

export default calcTotalPrice;