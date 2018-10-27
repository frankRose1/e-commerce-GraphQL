import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import {ApolloConsumer} from 'react-apollo';
import wait from 'waait';
import Cart, {LOCAL_STATE_QUERY} from '../components/Cart';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser} from '../lib/testUtils';

describe('<Cart />', () => {

  it('renders and matches the snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Cart />
      </MockedProvider>
    );
    const cart = wrapper.find('div[data-test="cart"]');
    expect(toJSON(cart)).toMatchSnapshot();
  });
});