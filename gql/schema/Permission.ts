import { gql } from 'graphql-tag';

export const Permission = gql`
  type Permission {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    resourceName: String!
    operationTypes: [OperationType!]!
  }

  enum OperationType {
    CREATE
    READ
    UPDATE
    DELETE
  }
`;
