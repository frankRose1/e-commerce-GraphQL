/**
 * Format dollar amount of an item
 * @param {integer} amount - dollar amount of an item in cents
 * @return newly formatted price as a string, US currency 
 */
export default function(amount){
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }
  //for whole dollar amounts, leave off the .00
  if (amount % 100 === 0) options.minimumFractionDigits = 0;
  const formatter = new Intl.NumberFormat('en-US', options);
  return formatter.format(amount / 100);
}