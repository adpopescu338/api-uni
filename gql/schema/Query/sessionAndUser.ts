import { gql } from 'graphql-tag';

export const sessionAndUser = gql`
  type Query {
    """
    Get the current session and user details
    """
    sessionAndUser: SessionAndUserResponse! @authenticated
  }

  type SessionAndUserResponse {
    session: Session!
    user: User!
  }
`;
