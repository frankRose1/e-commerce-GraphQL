import {mount} from 'enzyme';
import {MockedProvider} from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import NProgress from 'nprogress';
import Router from 'next/router';
import wait from 'waait';
import PurchaseItem, {CREATE_ORDER_MUTATION} from '../components/PurchaseItem';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

Router.router = { push() {} };

const mocks = [
  {
    request: {query: CURRENT_USER_QUERY},
    result: {
      data: { me: { 
        ...fakeUser(),
        cart: [fakeCartItem()]
      }}
    }
  },

];

describe("<PurchaseItem />", () => {

  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <PurchaseItem />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const checkoutButton = wrapper.find('ReactStripeCheckout');
    expect(toJSON(checkoutButton)).toMatchSnapshot();
  });

  it("creates an order ontoken", async () => {
    //need to mock the createOrder mutation because its executed inside of the onToken method
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {createOrder: { id: 'xyz789' } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <PurchaseItem />
      </MockedProvider>
    );
    const component = wrapper.find('PurchaseItem').instance();
    //manually call onToken method
    component.onToken({id: 'stripetoken'}, createOrderMock)
    expect(createOrderMock).toHaveBeenCalled();
    expect(createOrderMock).toHaveBeenCalledWith({"variables": {"token": "stripetoken"}});
  });

  it("turns the progress bar on when order is placed", async () => {
    NProgress.start = jest.fn();
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {createOrder: { id: 'xyz789' } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <PurchaseItem />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const component = wrapper.find('PurchaseItem').instance();
    component.onToken({id: 'stripetoken'}, createOrderMock);
    expect(NProgress.start).toHaveBeenCalled();
  });

  it("routes to the order page when completed", async  () => {
    Router.router.push = jest.fn();
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {createOrder: { id: 'xyz789' } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <PurchaseItem />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const component = wrapper.find('PurchaseItem').instance();
    component.onToken({id: 'stripetoken'}, createOrderMock);
    await wait();

    expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/order", "query": {"orderId": "xyz789"}});
  });
});