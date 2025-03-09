import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000', // Assuming your GraphQL server runs on this port
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;