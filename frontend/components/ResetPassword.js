import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import Form from './styles/Form';
import Router from 'next/router';
import Error from './ErrorMessage';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!){
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword){
      message
    }
  }
`;

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  };

  state = {
    password: '',
    confirmPassword: ''
  }

  handleInputChange = e => {
    const {value, name} = e.target;
    this.setState({ [name]: value} );
  }

  render() {
    const {resetToken} = this.props;
    return (
      <div>
        <p style={{textAlign: 'center', fontSize: '35px'}}>Your reset token is {resetToken}</p>
        <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken,
          ...this.state
        }}
        refetchQueries={[ {query: CURRENT_USER_QUERY} ]}>
          {(resetPassword, {error, loading}) => (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await resetPassword();
              this.setState({password: '', confirmPassword: ''});
              Router.push({
                pathname: '/'
              })
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error}/>
                <h2>Reset Your Password</h2>

                <label htmlFor="password">
                  Password
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required/>
                </label>

                <label htmlFor="confirmPassword">
                  Confirm Password
                  <input 
                    type="password" 
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.handleInputChange}
                    required/>
                </label>

              <button 
                type="submit"
                disabled={loading}>
                Reset{loading ? 'ing': ''} Password
              </button>
              </fieldset>
            </Form>
          )}
        </Mutation>
      </div>
    );
  }
}


export default ResetPassword;
export {RESET_PASSWORD_MUTATION};