import { gql } from 'graphql-tag';

export const assignRole = gql`
  type Mutation {
    """
    Only sysadmins can assign roles
    """
    assignRole(userId: String!, roleId: String!): User!
  }
`;
