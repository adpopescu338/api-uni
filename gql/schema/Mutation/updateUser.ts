import { gql } from 'graphql-tag';

export const updateUser = gql`
  type Mutation {
    """
    If you're not sysadmin, you must be authenticated as the user you're trying to update
    """
    updateUser(id: ID!, input: UpdateUserInput!): User! @authenticated
  }

  input UpdateUserInput {
    email: String
    name: String
    isSysAdmin: Boolean
    password: String
  }
`;
