import { describe, it, expect, jest } from '@jest/globals';
import { updateUser } from '../../gql/resolvers/Mutation/updateUser';
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
      update: jest.fn().mockResolvedValue(expectedResult as never),
    },
  },
  user: {
    isSysAdmin: true,
    id: 'id',
  },
  cacheManager: {
    del: jest.fn(),
    cacheKeys: {
      usersCount: 'usersCount',
    },
  },
} as unknown as Context;

const payload = {
  input: {
    name: 'name',
    email: 'email',
    password: 'password',
  },
  id: ctx.user!.id,
};

describe('updateUser', () => {
  it('Should be defined', () => {
    expect(updateUser).toBeDefined();
  });

  it('Should throw an error if user is not system admin and the userId is not the one provided', async () => {
    await expect(
      updateUser(undefined, payload, {
        ...ctx,
        user: { isSysAdmin: false, id: 'abc' },
      } as Context),
    ).rejects.toThrowError();
  });

  it('Should save the correct data and return the user', async () => {
    const result = await updateUser(undefined, payload, ctx);
    const { lastCall } = (ctx.prisma.user.update as jest.Mock).mock;

    expect(lastCall).toMatchSnapshot();

    expect(result).toEqual(expectedResult);
  });
});
