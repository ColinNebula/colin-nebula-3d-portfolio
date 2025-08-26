import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Auth from './auth';

// Log any GraphQL errors or network error
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Define the HTTP link
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql'
});

// Add authorization headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage
  const token = Auth.getToken();
  
  // Return the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create the Apollo Client with the links
const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
