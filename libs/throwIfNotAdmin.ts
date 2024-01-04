import { GraphQLError } from 'graphql/error/GraphQLError';
import { Context } from './types';

export const throwIfNotAdmin = (user: Context['user']) => {
  if (user?.isSysAdmin) return;
  throw new GraphQLError('Access denied', {
    extensions: {
      code: 'ACCESS_DENIED',
    },
  });
};
