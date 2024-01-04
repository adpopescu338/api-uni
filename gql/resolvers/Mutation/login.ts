import { Context, RedisSession } from 'libs/types';
import { MutationLoginArgs, Session } from 'libs/types/generated';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { omit } from 'lodash';

export const login = async (
  _: unknown,
  { email, password }: MutationLoginArgs,
  { prisma, cacheManager }: Context,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const ttl = 60 * 60 * 12; // 12 hours

  const sessionDetails: RedisSession = {
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
    id: uuidv4(),
    userId: user.id,
    user: omit(user, ['password']),
  };

  const sessionKey = cacheManager.cacheKeys.session.full(sessionDetails.id, user.id);

  // cache session details
  await cacheManager.set(sessionKey, sessionDetails, ttl);

  // return the sessionKey as base64 encoded string
  return Buffer.from(sessionKey).toString('base64');
};
