import { describe, it, expect, jest } from '@jest/globals';
import { listUsers } from 'gql/resolvers/Query/listUsers';
import { GraphQLError } from 'graphql';
import { Context } from 'libs/types';
import { ctx, expectedResultWithCountFromCache, expectedResultWithCountFromPrisma } from './data';

describe('listUsers', () => {
  it('Should be defined', () => {
    expect(listUsers).toBeDefined();
  });

  it('Should return the expected result', async () => {
    const result = await listUsers(null, {}, ctx);

    expect((ctx.prisma.user.findMany as jest.Mock).mock.calls).toMatchSnapshot();
    expect(result).toEqual(expectedResultWithCountFromCache);
    expect(ctx.cacheManager.get).toHaveBeenCalledWith('usersCount');
    expect(ctx.prisma.user.count).not.toHaveBeenCalledTimes(1);
  });

  it('Should return the expected result with count from prisma', async () => {
    (ctx.cacheManager.get as jest.Mock).mockResolvedValueOnce(null as never);

    const result = await listUsers(null, {}, ctx);

    expect((ctx.prisma.user.findMany as jest.Mock).mock.calls).toMatchSnapshot();
    expect(result).toEqual(expectedResultWithCountFromPrisma);
    expect(ctx.cacheManager.get).toHaveBeenCalledWith('usersCount');
    expect(ctx.prisma.user.count).toHaveBeenCalled();
    expect(ctx.cacheManager.set).toHaveBeenCalledWith(
      'usersCount',
      expectedResultWithCountFromPrisma.total,
    );
  });
});
