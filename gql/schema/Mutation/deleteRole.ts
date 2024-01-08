import { gql } from 'graphql-tag';

export const deleteRole = gql`
  type Mutation {
    """
    Only sysadmins can delete roles
    """
    deleteRole(id: ID!): VoidApiResponse! @sysadmin
  }
`;
