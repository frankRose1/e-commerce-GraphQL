import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import UserPermissions from './UserPermissions';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    usersPermissions {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => (
      <div>
        <Error error={error}/>
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map((perm, i) => (
                  <th key={i}>{perm}</th>
                ))}
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {data.usersPermissions.map(user => (
                <UserPermissions
                  key={user.id}
                  possiblePermissions={possiblePermissions}
                  user={user}/>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

export default Permissions;
export {ALL_USERS_QUERY};