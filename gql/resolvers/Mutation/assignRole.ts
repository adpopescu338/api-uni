import { Context } from 'libs/types';
import { MutationAssignRoleArgs } from 'libs/types/generated';
import { UserIncludeRolesAndPermissions, userIncludeRolesAndPermissions } from 'prisma/selectors';

export const assignRole = async (
  _: unknown,
  { userId, roleId }: MutationAssignRoleArgs,
  { prisma }: Context,
) => {
  const result: UserIncludeRolesAndPermissions = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roles: {
        connect: {
          id: roleId,
        },
      },
    },
    ...userIncludeRolesAndPermissions,
  });

  return result;
};
