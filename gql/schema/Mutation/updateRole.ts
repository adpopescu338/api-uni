import { gql } from 'graphql-tag';

export const updateRole = gql`
  type Mutation {
    """
    Only sysadmins can update roles
    """
    updateRole(id: ID!, description: String, name: String!, permissionIds: [ID!]!): UserDefinedRole!
  }
`;
