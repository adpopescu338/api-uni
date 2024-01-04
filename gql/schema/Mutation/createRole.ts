import { gql } from 'graphql-tag';

export const createRole = gql`
  type Mutation {
    """
    Only sysadmins can create roles
    """
    createRole(description: String, name: String!, permissionIds: [ID!]!): UserDefinedRole!
  }
`;
