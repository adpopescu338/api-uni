import { Context } from 'libs/types';
import { MutationDeleteRoleArgs } from 'libs/types/generated';
import { GraphQLError } from 'graphql';

export const deleteRole = async (
  _: unknown,
  { id }: MutationDeleteRoleArgs,
  { prisma }: Context,
) => {
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
