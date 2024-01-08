import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';
import gql from 'graphql-tag';

export const AuthenticatedDirective = (schema: GraphQLSchema): GraphQLSchema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'authenticated')?.[0];

      if (!directive) return;
      const { resolve = defaultFieldResolver } = fieldConfig;

      return {
        ...fieldConfig,
        resolve: async function (source, args, context, info) {
          if (!context?.user && !context.introspection) {
            throw new GraphQLError('not authorized', {
              extensions: {
                code: 'UNAUTHENTICATED',
              },
            });
          }

          return await resolve(source, args, context, info);
        },
      };
    },
  });

export const AuthenticatedTypeDef = gql`
  directive @authenticated on FIELD_DEFINITION
`;
