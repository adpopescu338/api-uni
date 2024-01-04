import { jest } from '@jest/globals';
import { Context } from 'libs/types';

export const mockSessionData = {
  id: '123',
  userId: '321',
  user: {
    id: '321',
  },
};

const user = {
  id: '321',
};

export const ctx = {
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue(user as never),
    },
  },
  cacheManager: {
    get: jest.fn().mockResolvedValue(null as never),
  },
} as unknown as Context;

export const expectedResult = {
  session: mockSessionData,
  user,
};
