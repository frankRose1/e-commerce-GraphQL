import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import { fakeUser } from '../lib/testUtils';
import UserPermissions, {
  UPDATE_PERMISSIONS_MUTATION
} from '../components/UserPermissions';
import { possiblePermissions } from '../components/Permissions';

const user = {
  ...fakeUser(),
  permissions: ['ADMIN', 'USER']
};

const mocks = [
  {
    request: {
      query: UPDATE_PERMISSIONS_MUTATION,
      variables: {
        userId: user.id,
        permissions: user.permissions
      }
    },
    result: {
      data: {
        updateUserPermissions: { ...fakeUser() }
      }
    }
  }
];

describe('<UserPermissions />', () => {
  it('renders and matches the snapsot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UserPermissions
          user={user}
          possiblePermissions={possiblePermissions}
        />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const row = wrapper.find('tr[data-test="permissions-row"]');
    expect(toJSON(row)).toMatchSnapshot();
  });

  it('checks off the inputs by default if the user has a certain permission', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <table>
          <tbody>
            <UserPermissions
              user={user}
              possiblePermissions={possiblePermissions}
            />
          </tbody>
        </table>
      </MockedProvider>
    );
    const row = wrapper.find('tr[data-test="permissions-row"]');
    expect(row.find(`[value="${user.permissions[0]}"]`).props().checked).toBe(
      true
    );
    expect(row.find(`[value="${user.permissions[1]}"]`).props().checked).toBe(
      true
    );
  });

  it('updates state on input change', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <table>
          <tbody>
            <UserPermissions
              user={user}
              possiblePermissions={possiblePermissions}
            />
          </tbody>
        </table>
      </MockedProvider>
    );
    const row = wrapper.find('tr[data-test="permissions-row"]');
    //check itemcreate and check itemdelete
    row
      .find('input[value="ITEMCREATE"]')
      .simulate('change', { target: { checked: true, value: 'ITEMCREATE' } });
    row
      .find('input[value="ITEMDELETE"]')
      .simulate('change', { target: { checked: true, value: 'ITEMDELETE' } });
    const component = wrapper.find('UserPermissions').instance();
    expect(component.state).toMatchObject({
      permissions: ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMDELETE']
    });
  });

  it('properly calls the mutation', async () => {
    const updateUserPermissionsMock = jest.fn().mockResolvedValue({
      data: {
        updateUserPermissions: { ...fakeUser() }
      }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <table>
          <tbody>
            <UserPermissions
              user={user}
              possiblePermissions={possiblePermissions}
            />
          </tbody>
        </table>
      </MockedProvider>
    );
    const component = wrapper.find('UserPermissions').instance();
    component.handleClick({}, updateUserPermissionsMock);
    expect(updateUserPermissionsMock).toHaveBeenCalledWith({
      variables: {
        userId: user.id,
        permissions: ['ADMIN', 'USER']
      }
    });
  });
});
