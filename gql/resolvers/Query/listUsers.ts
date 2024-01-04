import { GraphQLError } from 'graphql/error';
import { Context } from 'libs/types';
import { ListUsersResponse, QueryListUsersArgs } from 'libs/types/generated';

const DEFAULT_SIZE = 5;

export const listUsers = async (
  _: unknown,
  { page, size }: QueryListUsersArgs,
  ctx: Context,
): Promise<ListUsersResponse> => {
  if (!ctx.user?.isSysAdmin)
    throw new GraphQLError('Access denied', {
      extensions: {
        code: 'ACCESS_DENIED',
      },
    });

  size ??= DEFAULT_SIZE;
  const [users, total] = await Promise.all([
    ctx.prisma.user.findMany({
      skip: page ? (page - 1) * DEFAULT_SIZE : undefined,
      take: DEFAULT_SIZE,
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    }),
    countUsers(ctx),
  ]);

  const nextPage = users.length < size ? null : (page ?? 1) + 1;

  return {
    users,
    total,
    nextPage,
  } as ListUsersResponse;
};

const countUsers = async ({ prisma, cacheManager }: Context) => {
  const cachedCount = await cacheManager.get<number>(cacheManager.cacheKeys.usersCount);

  if (cachedCount === 0 || cachedCount) {
    return cachedCount;
  }

  const count = await prisma.user.count();

  // no need to await
  cacheManager.set(cacheManager.cacheKeys.usersCount, count);

  return count;
};
