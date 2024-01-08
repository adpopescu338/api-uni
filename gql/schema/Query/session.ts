import { gql } from 'graphql-tag';

export const session = gql`
  type Query {
    """
    Get the current session details (no user details are returned apart from the user ID)
    This will return an error if the user is not logged in
    """
    session: Session! @authenticated
  }

  type Session {
    id: String!
    userId: String!
    createdAt: String!
    expiresAt: String!
  }
`;
