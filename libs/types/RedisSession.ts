import { User } from '@prisma/client';
import { Session } from './generated';

export type RedisSession = Session & {
  user: Omit<User, 'password'>;
};
