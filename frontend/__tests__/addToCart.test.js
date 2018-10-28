import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import {ApolloConsumer} from 'react-apollo';
import wait from 'waait';
import AddToCart, {ADD_TO_CART_MUTATION} from '../components/AddToCart';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

const mocks = [
  //start user with empty cart
  {
    request: {query: CURRENT_USER_QUERY },
    result: { data: {
      me: {
        ...fakeUser(),
        cart: []
      }
    }}
  },
  //second user query for when user has click add to cart button
  {
    request: {query: CURRENT_USER_QUERY },
    result: { data: {
      me: {
        ...fakeUser(),
        cart: [fakeCartItem()]
      }
    }}
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { itemId: 'abc123'}},
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1
        }
      }
    }
  }
];

describe('<AddToCart />', () => {

  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <AddToCart itemId="abc123"/>
      </MockedProvider>
    );
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
  });

  it('adds an item to the cart when clicked', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart itemId="abc123"/>
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const {data: {me}} = await apolloClient.query({query: CURRENT_USER_QUERY});
    //cart should be empty before button is clicked
    expect(me.cart).toHaveLength(0);
    //simulate click and check if item is in cart
    wrapper.find('button').simulate('click');
    await wait();
    const {data: { me: me2 }} = await apolloClient.query({query: CURRENT_USER_QUERY});
    expect(me2.cart).toHaveLength(1);
    expect(me2.cart[0].id).toBe('omg123');
    expect(me2.cart[0].quantity).toBe(3);
  });

  it('changes from add to adding when button is clicked', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart itemId="abc123"/>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Add To Cart');
    //simulate a click and trigger the loading state
    wrapper.find('button').simulate('click');
    expect(wrapper.text()).toContain('Adding To Cart');
  });

});