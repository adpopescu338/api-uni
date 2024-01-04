import { Context } from 'libs/types';
import { GraphQLError } from 'graphql';

export const logout = async (_: unknown, __: unknown, { sessionKey, cacheManager }: Context) => {
  if (!sessionKey) {
    throw new GraphQLError('Not authenticated');
  }

  await cacheManager.del(sessionKey);

  return { success: true };
};
