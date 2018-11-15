import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import ItemProfile, { SINGLE_ITEM_QUERY } from '../components/ItemProfile';
import { fakeItem } from '../lib/testUtils';
import formatMoney from '../lib/formatMoney';

const item = fakeItem();

const mocks = [
  {
    //when a request is made with this query/variable
    request: { query: SINGLE_ITEM_QUERY, variables: { id: 'abc123' } },
    //return this mock data
    result: {
      data: {
        item: item
      }
    }
  }
];

const notFoundMocks = [
  {
    request: { query: SINGLE_ITEM_QUERY, variables: { id: 'noItem' } },
    result: {
      data: {
        item: null
      }
    }
  }
];

describe('<ItemProfile />', () => {
  it('renders with correct data', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ItemProfile id={'abc123'} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('.price').text()).toEqual(formatMoney(item.price));
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
    expect(wrapper.find('AddToCart').exists()).toBe(true);
    expect(wrapper.find('DeleteItem').exists()).toBe(true);
  });

  it('shows an error message if an item isnt found', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notFoundMocks}>
        <ItemProfile id={'noItem'} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const message = wrapper.find('[data-test="graphql-error"]');
    expect(toJSON(message)).toMatchSnapshot();
  });
});
