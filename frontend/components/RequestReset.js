import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!){
    requestReset(email: $email){
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: ''
  }

  handleInputChange = e => {
    const {value, name} = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}>
        {(requestReset, {error, loading, called}) => (
          <Form
            data-test="request-reset"
            method="post" 
            onSubmit={async e => {
            e.preventDefault();
            //could aslo set the success messagge to state and display a pop up when this resolves
            await requestReset();
            this.setState({ email: '' })
          }}>
          {!error && !loading && called && (<p>Success! Check your email for a reset link!</p>)}
          <fieldset disabled={loading} aria-busy={loading}>
            <Error error={error}/>
            <h2>Request Password Reset</h2>

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

            <button 
              type="submit"
              disabled={loading}>
              Request{loading ? 'ing': ''} Reset!
            </button>
          </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
export {REQUEST_RESET_MUTATION};