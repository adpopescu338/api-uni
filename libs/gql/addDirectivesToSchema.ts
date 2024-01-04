import { GraphQLSchema } from 'graphql';

export const addDirectivesToSchema = (
  schema: GraphQLSchema,
  directives: ((schema: GraphQLSchema) => GraphQLSchema)[]
) => directives.reduce((p, c) => c(p), schema);
