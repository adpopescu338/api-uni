import { describe, it, expect, jest } from '@jest/globals';
import { session } from '../gql/resolvers/Query/session';

describe('session', () => {
  it('Should be defined', () => {
    expect(session).toBeDefined();
  });

  it('Should return null if sessionKey is not in context', async () => {
    //@ts-expect-error - intentionally passing empty object
    const result = await session(null, null, {});

    expect(result).toBeNull();
  });

  it('Should search for sessionKey in cacheManager and return the result', async () => {
    const expectedResult = {
      id: '123',
      userId: '321',
    };

    const cacheManager = {
      get: jest.fn().mockResolvedValueOnce(expectedResult as never),
    };

    const sessionKey = 'session::123::321';

    const result = await session(null, null, {
      cacheManager: cacheManager,
      sessionKey,
    } as any);

    expect(result).toEqual(expectedResult);
  });
});
