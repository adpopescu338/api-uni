import { Context } from 'libs/types';
import { MutationUpdateUserArgs } from 'libs/types/generated';
import { throwIfNotAdmin } from 'libs/throwIfNotAdmin';
import { getHashedPassword } from 'libs/getHashedPassword';
import { GraphQLError } from 'graphql';
import { userIncludeRolesAndPermissions } from 'prisma/selectors';

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
      name: input.name || undefined,
      password: password || undefined,
      email: input.email || undefined,
      isSysAdmin: input.isSysAdmin || false,
    },
    ...userIncludeRolesAndPermissions,
  });

  if (!updatedUser) {
    throw new GraphQLError('User not found');
  }

  return {
    ...updatedUser,
    roles: updatedUser.roles || [],
  };
};
