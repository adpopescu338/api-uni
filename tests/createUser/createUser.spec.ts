import { describe, it, expect, jest } from '@jest/globals';
import { createUser } from 'gql/resolvers/Mutation/createUser';
import { Context } from 'libs/types';
import * as getHashedPasswordModule from 'libs/getHashedPassword';

jest.spyOn(getHashedPasswordModule, 'getHashedPassword').mockResolvedValue('hashed--password');

const expectedResult = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'hashed--password',
  roles: [],
};

const ctx = {
  prisma: {
    user: {
      create: jest.fn().mockResolvedValue(expectedResult as never),
    },
  },
  user: {
    isSysAdmin: true,
  },
  cacheManager: {
    del: jest.fn(),
    cacheKeys: {
      usersCount: 'usersCount',
    },
  },
} as unknown as Context;

const input = {
  name: 'name',
  email: 'email',
  password: 'password',
};

describe('createUser', () => {
  it('Should be defined', () => {
    expect(createUser).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      createUser(undefined, { input }, { ...ctx, user: { isSysAdmin: false } } as Context),
    ).rejects.toThrowError();
  });

  it('Should save the correct data and return the user', async () => {
    const result = await createUser(undefined, { input }, ctx);
    const { lastCall } = (ctx.prisma.user.create as jest.Mock).mock;

    expect(lastCall).toMatchSnapshot();

    expect(result).toEqual(expectedResult);
  });

  it('Should invalidate users count cache', async () => {
    await createUser(undefined, { input }, ctx);

    expect(ctx.cacheManager.del).toHaveBeenCalledWith(ctx.cacheManager.cacheKeys.usersCount);
  });
});
