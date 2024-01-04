import { GraphQLError } from 'graphql';
import { Context, RedisSession } from 'libs/types';
import { Session, SessionAndUserResponse } from 'libs/types/generated';

export const session = async (
  _: unknown,
  __: unknown,
  { cacheManager, prisma, sessionKey }: Context,
): Promise<SessionAndUserResponse | null> => {
  if (!sessionKey) return null;

  const sessionData = await cacheManager.get<RedisSession>(sessionKey, true);

  if (!sessionData) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: sessionData.user.id,
    },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  return {
    session: sessionData,
    user,
  } as SessionAndUserResponse;
};
