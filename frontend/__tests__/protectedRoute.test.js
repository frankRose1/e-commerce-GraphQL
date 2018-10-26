import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import wait from 'waait';
import ProtectedRoute from '../components/ProtectedRoute';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser} from '../lib/testUtils';

const notSignedInMocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: { data: {me: null} }
}];

const signedInMocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: { data: {me: fakeUser()} }
}];

describe("ProtectedRoute", () => {
  it("renders sign in text to a logged out user", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <ProtectedRoute />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain("Please sign in")
    expect(wrapper.find('SignIn').exists()).toBe(true);
  });

  it("renders child component for a signed in user", async () => {
    const Hey = () => <p>Hey!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <ProtectedRoute> <Hey /> </ProtectedRoute>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.contains(<Hey />)).toBe(true);
  });

});