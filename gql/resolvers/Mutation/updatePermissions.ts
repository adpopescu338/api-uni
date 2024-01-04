import { Permission } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { throwIfNotAdmin } from 'libs/throwIfNotAdmin';
import { Context, MutationUpdatePermissionsArgs } from 'libs/types';

export const updatePermissions = async (
  _: unknown,
  { permissions }: MutationUpdatePermissionsArgs,
  { user, prisma }: Context,
): Promise<Permission[]> => {
  throwIfNotAdmin(user);

  const updates = permissions.map(({ id, operationTypes, resourceName }) => {
    if (!operationTypes?.length && !resourceName) {
      throw new GraphQLError('No update data provided');
    }

    return prisma.permission.update({
      where: {
        id,
      },
      data: {
        ...(operationTypes && {
          operationTypes: {
            set: operationTypes,
          },
        }),
        ...(resourceName && { resourceName }),
      },
    });
  });

  const result = await prisma.$transaction(updates);

  return result;
};
