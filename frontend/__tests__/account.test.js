import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Account, { USER_ORDERS_QUERY } from '../components/Account';
import { fakeOrder } from '../lib/testUtils';

const mocks = [
  {
    request: { query: USER_ORDERS_QUERY },
    result: {
      data: {
        userOrders: [
          fakeOrder(),
          {
            ...fakeOrder(),
            id: 'ord124'
          },
          {
            ...fakeOrder(),
            id: 'ord125'
          }
        ]
      }
    }
  }
];

const noOrdersMocks = [
  {
    request: { query: USER_ORDERS_QUERY },
    result: {
      data: {
        userOrders: []
      }
    }
  }
];

describe('<Account />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Account />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('div[data-test="account"]'))).toMatchSnapshot();
  });

  it('displays order information', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Account />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('div[data-test="account"] h2').text()).toContain(
      '3 orders'
    );
  });

  it('renders a message when a user has no orders', async () => {
    const wrapper = mount(
      <MockedProvider mocks={noOrdersMocks}>
        <Account />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('p').text()).toContain(
      "Looks like you havn't ordered anything yet!"
    );
  });
});
