import pino from 'pino';
import { CacheManager } from '../cache';
import { client } from 'prisma/client';
import { User } from '@prisma/client';

export type Context = {
  logger: ReturnType<typeof pino>;
  prisma: typeof client;
  cacheManager: CacheManager;
  user: Omit<User, 'password'> | null;
  sessionKey: string | null | undefined;
};
