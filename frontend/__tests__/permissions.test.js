import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import Permissions, { ALL_USERS_QUERY } from '../components/Permissions';
import wait from 'waait';
import { fakeUser } from '../lib/testUtils';

const mocks = [
  {
    request: { query: ALL_USERS_QUERY },
    result: {
      data: {
        usersPermissions: [
          fakeUser(),
          {
            ...fakeUser(),
            id: '5467',
            permissions: ['USER']
          }
        ]
      }
    }
  }
];

describe('<Permissions />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Permissions />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const table = wrapper.find('table[data-test="permissions-table"]');
    expect(toJSON(table)).toMatchSnapshot();
  });

  it('renders a table row for each user', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Permissions />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const table = wrapper.find('table[data-test="permissions-table"]');
    expect(table.find('tbody').children()).toHaveLength(2);
  });
});
