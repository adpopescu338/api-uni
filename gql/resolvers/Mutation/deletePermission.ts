import { Context } from 'libs/types';
import { MutationDeletePermissionArgs } from 'libs/types/generated';
import { GraphQLError } from 'graphql/error/GraphQLError';

export const deletePermission = async (
  _: unknown,
  { id }: MutationDeletePermissionArgs,
  { prisma }: Context,
) => {
  const permission = await prisma.permission.delete({
    where: {
      id,
    },
  });

  if (!permission) {
    throw new GraphQLError('Permission not found', {
      extensions: {
        code: 'PERMISSION_NOT_FOUND',
      },
    });
  }

  return { success: true };
};
