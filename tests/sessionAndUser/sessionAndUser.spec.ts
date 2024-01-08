import { describe, it, expect, jest } from '@jest/globals';
import { sessionAndUser } from 'gql/resolvers/Query/sessionAndUser';
import { ctx, expectedResult, mockSessionData } from './data';

describe('sessionAndUser', () => {
  it('Should be defined', () => {
    expect(sessionAndUser).toBeDefined();
  });

  it('Should return null if sessionKey is not in context', async () => {
    const result = await sessionAndUser(null, null, ctx);

    expect(result).toBeNull();
  });

  it('Should throw an error if sessionKey is not in cache', async () => {
    const sessionKey = 'sessionKey';
    await expect(sessionAndUser(null, null, { ...ctx, sessionKey })).rejects.toThrow(
      'Invalid session',
    );
    expect(ctx.cacheManager.get).toHaveBeenCalledWith(sessionKey, true);
  });

  it('Should query the database and return the expected result', async () => {
    (ctx.cacheManager.get as jest.Mock).mockResolvedValueOnce(mockSessionData as never);

    const result = await sessionAndUser(null, null, { ...ctx, sessionKey: '123' });

    expect(result).toEqual(expectedResult);
    expect(ctx.cacheManager.get).toHaveBeenCalledWith('123', true);
    expect((ctx.prisma.user.findUnique as jest.Mock).mock.lastCall).toMatchSnapshot();
  });
});
