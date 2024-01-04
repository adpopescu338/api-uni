import { gql } from 'graphql-tag';

export const VoidApiResponse = gql`
  type VoidApiResponse {
    success: Boolean!
  }
`;
