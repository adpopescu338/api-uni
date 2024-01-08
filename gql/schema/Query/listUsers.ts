import { gql } from 'graphql-tag';

export const listUsers = gql`
  type Query {
    """
    Only sysadmins can list users
    """
    listUsers(size: Int, page: Int): ListUsersResponse! @sysadmin
  }

  type ListUsersResponse {
    users: [User!]!
    total: Int!
    nextPage: Int
  }
`;
