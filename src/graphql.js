import { gql } from '@apollo/client';

// Queries
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
    }
  }
`;

export const GET_SPIN_LISTS = gql`
  query GetSpinLists {
    getSpinLists {
      id
      title
      user {
        id
        username
      }
    }
  }
`;

// Only keeping the queries and mutations that are used in SpinWheel.js
export const GET_NAMES = gql`
  query GetNames($spinListId: ID!) {
    getNames(spinListId: $spinListId) {
      id
      value
    }
  }
`;

export const ADD_NAME = gql`
  mutation AddName($spinListId: ID!, $value: String!) {
    addName(spinListId: $spinListId, value: $value) {
      id
      value
    }
  }
`;

export const CLEAR_NAMES = gql`
  mutation ClearNames($spinListId: ID!) {
    clearNames(spinListId: $spinListId)
  }
`;

export const SPIN_TEMPORARY_NAMES = gql`
  mutation SpinTemporaryNames($names: [String!]!) {
    spinTemporaryNames(names: $names)
  }
`;