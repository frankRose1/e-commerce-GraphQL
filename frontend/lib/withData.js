import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint, prodEndpoint } from '../config';
import {LOCAL_STATE_QUERY} from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    //local state
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, {cache}){
            //need to pull the cartOpen boolean from cache and toggle it, then write it back in to cache
            const {cartOpen} = cache.readQuery({
              query: LOCAL_STATE_QUERY
            });
            const data = {
              data: { cartOpen: !cartOpen }
            };
            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);
