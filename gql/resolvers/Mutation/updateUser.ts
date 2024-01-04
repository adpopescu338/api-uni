import { Context } from 'libs/types';
import { MutationUpdateUserArgs } from 'libs/types/generated';
import { throwIfNotAdmin } from '../../../libs/throwIfNotAdmin';
import { getHashedPassword } from '../../../libs/getHashedPassword';

export const updateUser = async (
  _: unknown,
  { input, id }: MutationUpdateUserArgs,
  { prisma, user }: Context,
) => {
  // validate that the user is either sysadmin or the user being updated
  if (id !== user?.id) {
    throwIfNotAdmin(user);
  }

  const password = input.password ? await getHashedPassword(input.password) : undefined;

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...input,
      password,
      isSysAdmin: input.isSysAdmin || false,
    },
  });

  return updatedUser;
};
