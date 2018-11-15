import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import wait from 'waait';
import Sell, { CREATE_ITEM_MUTATION } from '../components/Sell';
import { fakeItem } from '../lib/testUtils';

Router.router = { push() {} };

const fakeImage = 'https://pizza.com/pizza.jpg';

//mock uploading images to cloudinary via fetch
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: fakeImage,
    eager: [{ secure_url: fakeImage }]
  })
});

describe('<Sell />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Sell />
      </MockedProvider>
    );
    const sellForm = wrapper.find('form[data-test="sell-form"]');
    expect(toJSON(sellForm)).toMatchSnapshot();
  });

  it('uploads images on change event', async () => {
    const wrapper = mount(
      <MockedProvider>
        <Sell />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: ['pizza.jpg'] } });
    await wait();
    //grab an instance of the component to be able to look at state
    const componentInstance = wrapper.find('Sell').instance();
    expect(componentInstance.state.image).toEqual(fakeImage);
    expect(componentInstance.state.largeImage).toEqual(fakeImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });

  it('updates state on change events', async () => {
    const wrapper = mount(
      <MockedProvider>
        <Sell />
      </MockedProvider>
    );
    wrapper
      .find('#title')
      .simulate('change', {
        target: { name: 'title', value: 'A new Item Title' }
      });
    wrapper
      .find('#price')
      .simulate('change', {
        target: { name: 'price', value: 5012, type: 'number' }
      });
    wrapper
      .find('#description')
      .simulate('change', {
        target: { name: 'description', value: 'a new item description!!!!' }
      });
    //see if state is equal to the changes in the inputs
    const componentInstance = wrapper.find('Sell').instance();
    expect(componentInstance.state).toMatchObject({
      title: 'A new Item Title',
      price: 5012,
      description: 'a new item description!!!!'
    });
  });

  it('creates an item on form submit', async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            price: item.price,
            description: item.description,
            image: '',
            largeImage: ''
          }
        },
        result: {
          data: { createItem: { ...item } }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Sell />
      </MockedProvider>
    );
    //simulate someone filling out the form
    wrapper
      .find('#title')
      .simulate('change', { target: { name: 'title', value: item.title } });
    wrapper
      .find('#price')
      .simulate('change', {
        target: { name: 'price', value: item.price, type: 'number' }
      });
    wrapper
      .find('#description')
      .simulate('change', {
        target: { name: 'description', value: item.description }
      });
    //simulate the router pushing to the item page
    Router.router.push = jest.fn();
    wrapper.find('form').simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: { id: 'abc123' }
    });
  });
});
