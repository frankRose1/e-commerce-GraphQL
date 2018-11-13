import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import DeleteItem, { DELETE_ITEM_MUTATION } from '../components/DeleteItem';
import wait from 'waait';
import { ALL_ITEMS_QUERY } from '../components/Items';
import { fakeItem } from '../lib/testUtils';

//this will be the item deleted
const item = fakeItem();

global.confirm = jest.fn(() => true);

const mocks = [
  {
    request: {
      query: DELETE_ITEM_MUTATION,
      variables: {
        id: item.id
      }
    },
    result: {
      data: {
        deleteItem: {
          id: item.id,
          __typename: 'Item'
        }
      }
    }
  },
  {
    request: {
      query: ALL_ITEMS_QUERY,
      variables: {
        skip: 0,
        first: 4
      }
    },
    result: {
      data: {
        items: [
          item,
          {
            ...fakeItem(),
            id: '6434'
          },
          {
            ...fakeItem(),
            id: '525h'
          }
        ]
      }
    }
  }
];

describe('<DeleteItem />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <DeleteItem id={item.id} />
      </MockedProvider>
    );
    const button = wrapper.find('button[data-test="delete-item"]');
    expect(toJSON(button)).toMatchSnapshot();
  });

  it('calls the mutation and deletes an item on button click', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <DeleteItem id={item.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    //query some items
    const {
      data: { items }
    } = await apolloClient.query({ query: ALL_ITEMS_QUERY });
    expect(items).toHaveLength(3);
    wrapper.find('button[data-test="delete-item"]').simulate('click');
    await wait();
    //query after the mutation
    const {
      data: { items: updatedItems }
    } = await apolloClient.query({ query: ALL_ITEMS_QUERY });
    const deletedItem = updatedItems.find(i => i.id === item.id);
    expect(updatedItems).toHaveLength(2);
    expect(deletedItem).toBe(undefined);
    global.confirm.mockReset();
  });
});
