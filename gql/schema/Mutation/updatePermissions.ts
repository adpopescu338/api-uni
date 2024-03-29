import { gql } from 'graphql-tag';

export const updatePermissions = gql`
  type Mutation {
    """
    Only sysadmins can update permissions
    """
    updatePermissions(permissions: [UpdatePermissionInput!]!): [Permission!]! @sysadmin
  }

  input UpdatePermissionInput {
    resourceName: String
    operationTypes: [OperationType!]
    id: ID!
  }
`;
