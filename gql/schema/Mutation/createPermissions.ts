import { gql } from 'graphql-tag';

export const createPermissions = gql`
  type Mutation {
    """
    Only sysadmins can create permissions
    """
    createPermissions(permissions: [PermissionInput!]!): [Permission!]! @sysadmin
  }

  input PermissionInput {
    resourceName: String!
    operationTypes: [OperationType!]!
  }
`;
