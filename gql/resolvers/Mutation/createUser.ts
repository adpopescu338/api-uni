import { Context } from 'libs/types';
import { MutationCreateUserArgs } from 'libs/types/generated';
import { getHashedPassword } from 'libs/getHashedPassword';

export const createUser = async (
  _: unknown,
  { input }: MutationCreateUserArgs,
  { prisma, cacheManager }: Context,
) => {
  const password = await getHashedPassword(input.password);

  const newUser = await prisma.user.create({
    data: {
      ...input,
      password,
      isSysAdmin: input.isSysAdmin || false,
    },
  });

  cacheManager.del(cacheManager.cacheKeys.usersCount);

  return {
    ...newUser,
    roles: [],
  };
};
