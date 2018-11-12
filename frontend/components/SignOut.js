import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const SignOut = () => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signout, { loading, error }) => (
      <button data-test='sign-out' disabled={loading} onClick={signout}>
        Sign Out
      </button>
    )}
  </Mutation>
);

export default SignOut;
export { SIGN_OUT_MUTATION };
