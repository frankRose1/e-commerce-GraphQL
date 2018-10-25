import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';
import {CURRENT_USER_QUERY} from './User';

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!){
    signin(email: $email, password: $password){
      id
    }
  }
`;

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  }

  handleInputChange = e => {
    const {value, name} = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={SIGN_IN_MUTATION}
        variables={this.state}
        refetchQueries={[ {query: CURRENT_USER_QUERY} ]}>
        {(signin, {error, loading}) => (
          <Form method="post" onSubmit={async e => {
            e.preventDefault();
            await signin();
            this.setState({ email: '', password: ''})
          }}>
          
          <fieldset disabled={loading} aria-busy={loading}>
            <Error error={error}/>
            <h2>Sign In</h2>

            <label htmlFor="email">
              Email Address
              <input 
                type="email" 
                id="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required/>
            </label>

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

            <button 
              type="submit"
              disabled={loading}>
              Sig{loading ? 'ning': 'n'} In!
            </button>
          </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
export {SIGN_IN_MUTATION};