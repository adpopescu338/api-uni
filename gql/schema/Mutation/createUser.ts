import { gql } from 'graphql-tag';

export const createUser = gql`
  type Mutation {
    """
    Only sysadmins can create users
    """
    createUser(input: UserInput!): User! @sysadmin
  }

  input UserInput {
    email: String!
    name: String!
    isSysAdmin: Boolean = false
    password: String!
  }
`;
