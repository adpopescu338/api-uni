import { gql } from 'graphql-tag';

export const login = gql`
  type Mutation {
    """
    Create a session for a user
    The session ID is returned as a string
    This needs to be sent in subsequent requests as a header called 'x-session-id'
    """
    login(email: String!, password: String!): String!
  }
`;
