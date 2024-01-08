import { gql } from 'graphql-tag';

export const User = gql`
  type User {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    email: String!
    isSysAdmin: Boolean!
    roles: [UserDefinedRole]!
  }
`;
