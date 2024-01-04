import { jest } from '@jest/globals';
import { Context } from 'libs/types';

const cachedUsersCount = 2;
const prismaUsersCount = 3;
const mockUsers = [{ id: '1' }, { id: '2' }];

export const ctx = {
  user: {
    isSysAdmin: true,
  },
  cacheManager: {
    get: jest.fn().mockResolvedValue(cachedUsersCount as never),
    set: jest.fn(),
    cacheKeys: {
      usersCount: 'usersCount',
    },
  },
  prisma: {
    user: {
      count: jest.fn().mockResolvedValue(prismaUsersCount as never),
      findMany: jest.fn().mockResolvedValue(mockUsers as never),
    },
  },
} as unknown as Context;

export const expectedResultWithCountFromCache = {
  users: mockUsers,
  total: cachedUsersCount,
  nextPage: null,
};

export const expectedResultWithCountFromPrisma = {
  users: mockUsers,
  total: prismaUsersCount,
  nextPage: null,
};
