import { Context } from 'libs/types';
import { MutationCreatePermissionsArgs } from 'libs/types/generated';

export const createPermissions = async (
  _: unknown,
  { permissions }: MutationCreatePermissionsArgs,
  { prisma }: Context,
) => {
  const createdPermissions = await prisma.permission.createMany({
    data: permissions,
  });

  return createdPermissions;
};
