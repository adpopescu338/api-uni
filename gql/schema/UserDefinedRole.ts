import { gql } from 'graphql-tag';

export const UserDefinedRole = gql`
  type UserDefinedRole {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    description: String
    name: String!
    permissions: [Permission!]!
  }
`;
