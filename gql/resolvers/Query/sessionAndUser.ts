import { GraphQLError } from 'graphql';
import { Context, RedisSession } from 'libs/types';
import { SessionAndUserResponse } from 'libs/types/generated';
import { UserIncludeRolesAndPermissions, userIncludeRolesAndPermissions } from '../../../prisma/selectors';

export const sessionAndUser = async (
  _: unknown,
  __: unknown,
  { cacheManager, prisma, sessionKey }: Context,
): Promise<SessionAndUserResponse | null> => {
  if (!sessionKey) return null;

  const sessionData = await cacheManager.get<RedisSession>(sessionKey, true);

  if (!sessionData) {
    throw new GraphQLError('Invalid session');
  }

  const user: UserIncludeRolesAndPermissions | null = await prisma.user.findUnique({
    where: {
      id: sessionData.user.id,
    },
    ...userIncludeRolesAndPermissions,
  });

  return {
    session: sessionData,
    user,
  } as SessionAndUserResponse;
};
