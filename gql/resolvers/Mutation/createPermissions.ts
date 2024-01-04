import { Context } from 'libs/types';
import { MutationCreatePermissionsArgs } from 'libs/types/generated';
import { throwIfNotAdmin } from '../../../libs/throwIfNotAdmin';

export const createPermissions = async (
  _: unknown,
  { permissions }: MutationCreatePermissionsArgs,
  { prisma, user }: Context,
) => {
  throwIfNotAdmin(user);

  const createdPermissions = await prisma.permission.createMany({
    data: permissions,
  });

  return createdPermissions;
};
