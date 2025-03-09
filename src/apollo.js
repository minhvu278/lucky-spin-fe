import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;