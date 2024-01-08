import { Context } from 'libs/types';
import { MutationDeleteRoleArgs } from 'libs/types/generated';
import { throwIfNotAdmin } from 'libs/throwIfNotAdmin';
import { GraphQLError } from 'graphql';

export const deleteRole = async (
  _: unknown,
  { id }: MutationDeleteRoleArgs,
  { prisma, user }: Context,
) => {
  throwIfNotAdmin(user);

  const result = await prisma.userDefinedRole.delete({
    where: {
      id,
    },
  });

  if (!result) {
    throw new GraphQLError('Role not found', {
      extensions: {
        code: 'ROLE_NOT_FOUND',
      },
    });
  }

  return { success: true };
};
