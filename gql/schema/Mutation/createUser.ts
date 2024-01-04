import { gql } from 'graphql-tag';

export const createUser = gql`
  type Mutation {
    """
    Only sysadmins can create users
    """
    createUser(input: UserInput!): User!
  }

  input UserInput {
    email: String!
    name: String!
    isSysAdmin: Boolean!
    password: String!
  }
`;
