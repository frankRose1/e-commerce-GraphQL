import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import wait from 'waait';
import SignOut, { SIGN_OUT_MUTATION } from '../components/SignOut';
import { CURRENT_USER_QUERY } from '../components/User';

const mocks = [
  {
    request: { query: SIGN_OUT_MUTATION },
    result: {
      data: {
        signout: {
          message: 'You are now logged out',
          __typename: 'SuccessMessage'
        }
      }
    }
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: null
      }
    }
  }
];

describe('<SignOut />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SignOut />
      </MockedProvider>
    );
    const button = wrapper.find('button[data-test="sign-out"]');
    expect(toJSON(button)).toMatchSnapshot();
  });

  it('calls the signOut mutation and current user becomes null', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <SignOut />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const button = wrapper.find('button[data-test="sign-out"]');
    button.simulate('click');
    await wait();
    //query the user our of the apollo client manually
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res.data.me).toBe(null);
  });
});
