import { UserDefinedRole } from '@prisma/client';
import { Context, MutationUpdateRoleArgs } from 'libs/types';

export const updateRole = async (
  _: unknown,
  { name, description, permissionIds, id }: MutationUpdateRoleArgs,
  { prisma }: Context,
): Promise<UserDefinedRole> => {
  const result = await prisma.userDefinedRole.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      permissions: {
        set: permissionIds.map((id) => ({ id })),
      },
    },
  });

  return result;
};
