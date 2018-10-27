import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import {CURRENT_USER_QUERY} from './User';
import Error from './ErrorMessage';
import Form from './styles/Form';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION($email: String!, $name: String!, $password: String!, $confirmPassword: String!){
    signup(email: $email, name: $name, password: $password, confirmPassword: $confirmPassword){
      id
    }
  }
`;

class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  handleInputChange = e => {
    const {value, name} = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={SIGN_UP_MUTATION}
        variables={this.state}
        refetchQueries={[ {query: CURRENT_USER_QUERY} ]}>
        {(signup, {error, loading}) => (
          <Form 
            data-test="signup-form"
            method="post" 
            onSubmit={async e => {
            e.preventDefault();
            await signup();
            this.setState({ email: '', password: '', confirmPassword: '', name: ''})
          }}>
          
          <fieldset disabled={loading} aria-busy={loading}>
            <Error error={error}/>
            <h2>Sign Up</h2>

            <label htmlFor="name">
              Name
              <input 
                type="text" 
                id="name"
                name="name"
                placeholder="Name"
                value={this.state.name}
                onChange={this.handleInputChange}
                required/>
            </label>

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
              Sig{loading ? 'ning': 'n'} Up!
            </button>
          </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignUp;
export {SIGN_UP_MUTATION};