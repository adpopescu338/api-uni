import { describe, it, expect, jest } from '@jest/globals';
import { login } from 'gql/resolvers/Mutation/login';
import { Context } from 'libs/types';
import { ctx, args, mockUser, expectedReturn, sessionDetails, now, uuid, sessionKey } from './data';
import bcrypt from 'bcryptjs';

// use function to hoist so it can be used in jest.mock
function v4Mock() {
  return uuid;
}

const bcryptSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
jest.useFakeTimers({ now });
jest.mock('uuid', () => ({
  v4: v4Mock,
}));

describe('login', () => {
  it('Should be defined', () => {
    expect(login).toBeDefined();
  });

  it('Should throw an error if no user is found', async () => {
    await expect(login(null, args, ctx as unknown as Context)).rejects.toThrowError();
    expect(ctx.prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(ctx.prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: args.email,
      },
    });
  });

  it('Should cache the session details', async () => {
    ctx.prisma.user.findUnique.mockResolvedValueOnce(mockUser as never);
    await login(null, args, ctx as unknown as Context);

    expect(ctx.cacheManager.set).toHaveBeenCalledTimes(1);
    expect(ctx.cacheManager.set).toHaveBeenCalledWith(
      sessionKey, // cache key
      sessionDetails, // cache value
      60 * 60 * 12, // ttl, 12 hours
    );
  });

  it('Should return a base64 encoded string', async () => {
    ctx.prisma.user.findUnique.mockResolvedValueOnce(mockUser as never);
    const result = await login(null, args, ctx as unknown as Context);

    expect(result).toEqual(expectedReturn);
  });

  it('Should throw an error if the password is invalid', async () => {
    bcryptSpy.mockResolvedValueOnce(false as never);

    await expect(login(null, args, ctx as unknown as Context)).rejects.toThrowError();
  });
});
