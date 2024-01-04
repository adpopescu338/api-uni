import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';
import gql from 'graphql-tag';

export const SysAdminDirective = (schema: GraphQLSchema): GraphQLSchema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'sysadmin')?.[0];
      console.log('directive ========== ', directive);
      if (!directive) return;

      const { resolve = defaultFieldResolver } = fieldConfig;

      return {
        ...fieldConfig,
        resolve: function (source, args, context, info) {
          console.log('context.user =========== ', context);
          if (!context?.user?.isSysAdmin && !context.introspection) {
            throw new GraphQLError('Access denied', {
              extensions: {
                code: 'ACCESS_DENIED',
              },
            });
          }

          return resolve(source, args, context, info);
        },
      };
    },
  });

export const SysAdminTypeDef = gql`
  directive @sysadmin on FIELD_DEFINITION
`;
