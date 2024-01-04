import { Context, RedisSession } from 'libs/types';
import { Request } from 'express';

export const buildContext = async (
  req: Request,
  ctx: Pick<Context, 'prisma' | 'cacheManager' | 'logger'>,
): Promise<Context> => {
  const sessionKey = req.headers['x-session-id'] as string;
  if (!sessionKey) {
    return { ...ctx, user: null, sessionKey: null };
  }

  const decodedSessionKey = Buffer.from(sessionKey, 'base64').toString('ascii');

  const { cacheManager } = ctx;
  const sessionData = await cacheManager.get<RedisSession>(decodedSessionKey, true);

  if (!sessionData) {
    throw new Error(`Unauthorized`); // Todo: replace with a custom error
  }

  return { ...ctx, user: sessionData.user, sessionKey: decodedSessionKey };
};
