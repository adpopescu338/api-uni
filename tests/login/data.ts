import { jest } from '@jest/globals';

export const args = { email: 'test@mail.com', password: '12345' };

export const mockUser = {
  id: '123',
};

export const now = new Date('2021-01-01T00:00:00.000Z');
export const uuid = 'random-uuid';

export const sessionDetails = {
  createdAt: now.toISOString(),
  expiresAt: new Date(now.getTime() + 60 * 60 * 12 * 1000).toISOString(),
  id: uuid,
  userId: mockUser.id,
  user: mockUser,
};

export const sessionKey = `session:${sessionDetails.id}:${sessionDetails.userId}`;

export const expectedReturn = Buffer.from(sessionKey).toString('base64');

export const ctx = {
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue(null as never),
    },
  },
  cacheManager: {
    set: jest.fn(),
    cacheKeys: {
      session: {
        full: jest.fn().mockReturnValue(sessionKey),
      },
    },
  },
};
