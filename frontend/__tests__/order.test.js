import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { fakeOrder } from '../lib/testUtils';
import formatMoney from '../lib/formatMoney';

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { orderId: 'ord123' } },
    result: {
      data: {
        order: {
          ...fakeOrder()
        }
      }
    }
  }
];

const noOrderMocks = [
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: { orderId: 'doesntExist' }
    },
    result: {
      data: {
        order: null
      }
    }
  }
];

describe('<Order />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order orderId='ord123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('div[data-test="order"]'))).toMatchSnapshot();
  });

  it('properly displays order information', async () => {
    const order = fakeOrder();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order orderId='ord123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('[data-test="order-id"]').text()).toEqual(order.id);
    expect(wrapper.find('[data-test="order-total"]').text()).toEqual(
      formatMoney(order.total)
    );
    expect(wrapper.find('[data-test="order-charge"]').text()).toEqual(
      order.charge
    );
  });

  it('shows the correct amount of items in the order', async () => {
    const order = fakeOrder();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order orderId='ord123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('div.items').children()).toHaveLength(
      order.items.length
    );
  });

  it('shows a message when no order is found', async () => {
    const wrapper = mount(
      <MockedProvider mocks={noOrderMocks}>
        <Order orderId='doesntExist' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const message = wrapper.find('p');
    expect(message.text()).toContain('No order found');
  });
});
