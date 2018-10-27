import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import RequestReset, {REQUEST_RESET_MUTATION} from '../components/RequestReset'

const mocks = [
  {
    request: { query: REQUEST_RESET_MUTATION, variables: { email: 'test@test.com' }},
    result: {
      data: { requestReset: { message: 'Success!', __typename: 'SuccessMessage'} }
    }
  }
];

describe('<RequestReset />', () => {

  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="request-reset"]');
    expect(toJSON(form)).toMatchSnapshot();
  });
  
  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    //simulate typing in to the email input, passing in the expected event.target
    wrapper
      .find('input')
      .simulate('change', {target: { name: 'email', value: 'test@test.com' } });
    //submit the form
    wrapper.find('form').simulate('submit');
    await wait(50);
    wrapper.update();
    expect(wrapper.find('p').text()).toContain("Success! Check your email for a reset link!");
  });

})