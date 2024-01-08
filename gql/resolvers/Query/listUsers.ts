import { throwIfNotAdmin } from 'libs/throwIfNotAdmin';
import { Context } from 'libs/types';
import { ListUsersResponse, QueryListUsersArgs } from 'libs/types/generated';
import { UserIncludeRolesAndPermissions, userIncludeRolesAndPermissions } from 'prisma/selectors';

const DEFAULT_SIZE = 5;

export const listUsers = async (
  _: unknown,
  { page, size }: QueryListUsersArgs,
  ctx: Context,
): Promise<ListUsersResponse> => {
  throwIfNotAdmin(ctx.user);

  size ??= DEFAULT_SIZE;
  const [users, total]: [UserIncludeRolesAndPermissions[], number] = await Promise.all([
    ctx.prisma.user.findMany({
      skip: page ? (page - 1) * DEFAULT_SIZE : undefined,
      take: DEFAULT_SIZE,
      ...userIncludeRolesAndPermissions,
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
