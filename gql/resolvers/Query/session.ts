import { Context, RedisSession } from 'libs/types';
import { Session } from 'libs/types/generated';

export const session = async (
  _: unknown,
  __: unknown,
  { cacheManager, sessionKey }: Context,
): Promise<Session | null | undefined> => {
  if (!sessionKey) return null;

  const sessionData = await cacheManager.get<RedisSession>(sessionKey, true);

  return sessionData;
};
