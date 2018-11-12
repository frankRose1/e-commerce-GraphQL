import toJSON from 'enzyme-to-json';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import Router from 'next/router';
import wait from 'waait';
import UpdateItem, { SINGLE_ITEM_QUERY } from '../components/UpdateItem';
import { fakeItem } from '../lib/testUtils';

const updates = {
  title: 'Updated Title',
  description: 'new desc',
  price: 30000
};

const mocks = [
  {
    request: { query: SINGLE_ITEM_QUERY, variables: { id: 'abc123' } },
    result: {
      data: {
        item: { ...fakeItem() }
      }
    }
  }
];

describe('<UpdateItem />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UpdateItem id='abc123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(
      toJSON(wrapper.find('form[data-test="update-item"]'))
    ).toMatchSnapshot();
  });

  it('displays the item information in the form inputs', async () => {
    const item = fakeItem();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UpdateItem id='abc123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('input[name="title"]').props().defaultValue).toBe(
      item.title
    );
    expect(
      wrapper.find('textarea[name="description"]').props().defaultValue
    ).toBe(item.description);
    expect(wrapper.find('input[name="price"]').props().defaultValue).toBe(
      item.price
    );
  });

  it('properly updates state', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UpdateItem id='abc123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    wrapper.find('textarea[name="description"]').simulate('change', {
      target: { name: 'description', value: updates.description }
    });
    wrapper
      .find('input[name="title"]')
      .simulate('change', { target: { name: 'title', value: updates.title } });
    wrapper
      .find('input[name="price"]')
      .simulate('change', { target: { name: 'price', value: updates.price } });
    const component = wrapper.find('UpdateItem').instance();
    expect(component.state.title).toEqual(updates.title);
    expect(component.state.description).toEqual(updates.description);
    expect(component.state.price).toEqual(updates.price);
  });

  it('properly calls the mutation', async () => {
    //need to mock the updateItem mutation because its executed inside handleSubmit
    const updateItemMock = jest.fn().mockResolvedValue({
      data: { updateItem: { ...fakeItem() } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UpdateItem id='abc123' />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    wrapper.find('textarea[name="description"]').simulate('change', {
      target: { name: 'description', value: updates.description }
    });
    wrapper
      .find('input[name="title"]')
      .simulate('change', { target: { name: 'title', value: updates.title } });
    wrapper
      .find('input[name="price"]')
      .simulate('change', { target: { name: 'price', value: updates.price } });
    wrapper.update();
    const component = wrapper.find('UpdateItem').instance();
    component.handleSubmit({ preventDefault: jest.fn() }, updateItemMock);
    expect(updateItemMock).toHaveBeenCalledWith({
      variables: {
        ...component.state,
        id: 'abc123'
      }
    });
  });
});
