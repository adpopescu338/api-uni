import { GraphQLDateTime } from 'graphql-iso-date';
import { Mutation } from './Mutation';
import { Query } from './Query';

export const resolvers = {
  DateTime: GraphQLDateTime as any,
  Mutation,
  Query,
};
