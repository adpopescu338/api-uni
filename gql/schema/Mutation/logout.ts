import { gql } from 'graphql-tag';

export const logout = gql`
  type Mutation {
    """
    Delete the current session
    """
    logout: VoidApiResponse! @authenticated
  }
`;
