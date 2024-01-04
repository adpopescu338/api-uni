import { UserDefinedRole } from '@prisma/client';
import { throwIfNotAdmin } from 'libs/throwIfNotAdmin';
import { Context, MutationUpdateRoleArgs } from 'libs/types';

export const updateRole = async (
  _: unknown,
  { name, description, permissionIds, id }: MutationUpdateRoleArgs,
  { user, prisma }: Context,
): Promise<UserDefinedRole> => {
  throwIfNotAdmin(user);

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
