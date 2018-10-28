import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import {ApolloConsumer} from 'react-apollo';
import wait from 'waait';
import RemoveFromCart, {REMOVE_FROM_CART_MUTATION} from '../components/RemoveFromCart';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

/**
 * RemoveFromCart has an update function that will run once the mutation sends back data
 * dont need to write a second user query mock because it is handled manually in the update
 */

const mocks = [
  //current user for when the component mounts
  {
    request: {query: CURRENT_USER_QUERY },
    result: {
      data: { me: {
        ...fakeUser(),
        cart: [fakeCartItem({id: 'abc123'})]
      }}
    },
  },
  {
    request: {query: REMOVE_FROM_CART_MUTATION, variables: { cartItemId: 'abc123'}},
    result: {
      data: {
        removeFromCart : {
          __typename: 'CartItem',
          id: 'abc123'
        }
      }
    },
  },
];

describe('<RemoveFromCart />', () => {

  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <RemoveFromCart cartItemId="abc123" />
      </MockedProvider>
    );
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
  });

  it("removes item from cart after button is clicked", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return  <RemoveFromCart cartItemId="abc123" />
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const {data : { me } } = await apolloClient.query({query: CURRENT_USER_QUERY });
    expect(me.cart).toHaveLength(1);
    expect(me.cart[0].item.price).toBe(5000);
    //simulate clicking the button and removing the cart Item
    wrapper.find('button').simulate('click');
    await wait();
    const {data: { me: me2 } } = await apolloClient.query({query: CURRENT_USER_QUERY });
    expect(me2.cart).toHaveLength(0);
  });
});