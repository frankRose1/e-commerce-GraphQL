import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import {ApolloConsumer} from 'react-apollo';
import wait from 'waait';
import SignUp, {SIGN_UP_MUTATION} from '../components/SignUp';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser} from '../lib/testUtils';

function type(wrapper, name, value){
  wrapper.find(`input[name="${name}"]`).simulate('change', {target: {name, value} });
}

const me = fakeUser();
const mocks = [
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: 'test123',
        confirmPassword: 'test123'
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          name: me.name,
          email: me.email,
          id: 'abc123'
        }
      }
    },
  },
  //current user query mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } }
  }
];

/**
 * After a user signs up, querying the current user should return data about the user
 * this is how to check that both the mutation and query are working
 */

describe('<SignUp />', () => {

  it('renders and matches the snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="signup-form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  //after the signup mutation, the current user query is called. need to apollo client to call the query manually
  it('calls the signup mutation properly', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <SignUp />
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    //simulate typing in to the form
    type(wrapper, 'name', me.name);
    type(wrapper, 'email', me.email);
    type(wrapper, 'password', 'test123');
    type(wrapper, 'confirmPassword', 'test123');
    wrapper.update()
    wrapper.find('form[data-test="signup-form"]').simulate('submit');
    await wait(30);
    //query the user out of the apollo client
    const user = await apolloClient.query({query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});