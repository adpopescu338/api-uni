import { describe, it, expect, jest } from '@jest/globals';
import { logout } from '../gql/resolvers/Mutation/logout';
import { Context } from 'libs/types';

const ctx = {
  sessionKey: 'sessionKey',
  cacheManager: {
    del: jest.fn(),
  },
} as unknown as Context;

describe('logout', () => {
  it('Should be defined', () => {
    expect(logout).toBeDefined();
  });

  it('Should throw an error if sessionKey is not provided', async () => {
    await expect(logout(undefined, undefined, {} as Context)).rejects.toThrow('Not authenticated');
  });

  it('Should delete the sessionKey from the cache', async () => {
    await logout(undefined, undefined, ctx);

    expect(ctx.cacheManager.del).toHaveBeenCalledWith(ctx.sessionKey);
  });

  it('Should return success true', async () => {
    const result = await logout(undefined, undefined, ctx);

    expect(result).toEqual({ success: true });
  });
});
