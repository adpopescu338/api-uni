import { gql } from 'graphql-tag';

export const deletePermission = gql`
  type Mutation {
    """
    Only sysadmins can delete permissions
    """
    deletePermission(id: ID!): VoidApiResponse!
  }
`;
