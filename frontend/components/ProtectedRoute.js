import React from 'react';
import {Query} from 'react-apollo';
import SignIn from './SignIn';
import {CURRENT_USER_QUERY} from './User';

const ProtectedRoute = props =>  (
  <Query query={CURRENT_USER_QUERY}>
    {({data, loading}) => {
      if (loading) return <p>Loading...</p>
      return !data.me
        ? (
            <div>
              <p>Please sign in before continuing.</p>
              <SignIn />
            </div>
          )
        : props.children
    }}
  </Query>
);

export default ProtectedRoute;