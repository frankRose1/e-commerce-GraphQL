import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Button from './styles/SickButton';
import Error from './ErrorMessage';

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $userId: ID!
    $permissions: [Permission]
  ) {
    updateUserPermissions(userId: $userId, permissions: $permissions) {
      id
      name
      email
      permissions
    }
  }
`;

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      permissions: PropTypes.array.isRequired
    }).isRequired,
    possiblePermissions: PropTypes.array.isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  handleClick = async (e, mutation) => {
    const res = await mutation({
      variables: {
        userId: this.props.user.id,
        permissions: this.state.permissions
      }
    });
  };

  handleInputChange = e => {
    const { checked, value } = e.target;
    let updatedPermissions = [...this.state.permissions];
    //figure our if we need to add this permission
    //if its checked, then add it, else remove it
    if (checked) {
      updatedPermissions.push(value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== value
      );
    }

    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const { user, possiblePermissions } = this.props;
    const { permissions } = this.state;
    const { email, name, id } = user;

    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION}>
        {(updateUserPermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colspan='8'>
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr data-test='permissions-row'>
              <td>{name}</td>
              <td>{email}</td>
              {possiblePermissions.map((permission, i) => (
                <td key={i}>
                  <label htmlFor={`${id}-permission-${permission}`}>
                    <input
                      type='checkbox'
                      id={`${id}-permission-${permission}`}
                      checked={permissions.includes(permission)}
                      value={permission}
                      disabled={loading}
                      onChange={this.handleInputChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <Button
                  type='button'
                  data-test='update-button'
                  disabled={loading}
                  onClick={e => this.handleClick(e, updateUserPermissions)}
                >
                  Updat{loading ? 'ing' : 'e'}
                </Button>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default UserPermissions;
export { UPDATE_PERMISSIONS_MUTATION };
