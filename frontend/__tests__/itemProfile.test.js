import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import {MockedProvider} from 'react-apollo/test-utils';
import wait from 'waait';
import ItemProfile, {SINGLE_ITEM_QUERY} from '../components/ItemProfile';
import {fakeItem} from '../lib/testUtils';

describe("<ItemProfile />", () => {
  it("renders with correct data", async () => {

    const mocks = [{
      //when a request is made with this query/variable
      request: {query: SINGLE_ITEM_QUERY, variables: {id: 'abc123'} },
      //return this mock data
      result: { data: {
        item: fakeItem()
      }}
    }];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ItemProfile id={"abc123"} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
  });

  it("Errors on a not found item", async () => {
    const mocks = [{
      request: {query: SINGLE_ITEM_QUERY, variables: {id: 'abc123'} },
      result: {errors: [ {message: 'Item not found!'} ]}
    }];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ItemProfile id={"abc123"} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const message = wrapper.find('[data-test="graphql-error"]');
    expect(message.text()).toContain("Item not found!");
    expect(toJSON(message)).toMatchSnapshot();
  });
})