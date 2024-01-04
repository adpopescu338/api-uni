import { Context } from 'libs/types';
import { MutationCreateUserArgs } from 'libs/types/generated';
import { throwIfNotAdmin } from '../../../libs/throwIfNotAdmin';
import { getHashedPassword } from '../../../libs/getHashedPassword';

export const createUser = async (
  _: unknown,
  { input }: MutationCreateUserArgs,
  { prisma, user, cacheManager }: Context,
) => {
  throwIfNotAdmin(user);

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
