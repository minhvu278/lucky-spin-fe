import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import SpinWheel from './pages/SpinWheel';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<SpinWheel />} />
          <Route path="/spin/:spinListId" element={<SpinWheel />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
