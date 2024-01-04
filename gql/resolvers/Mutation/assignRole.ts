import { Context } from 'libs/types';
import { MutationAssignRoleArgs } from 'libs/types/generated';
import { throwIfNotAdmin } from '../../../libs/throwIfNotAdmin';

export const assignRole = async (
  _: unknown,
  { userId, roleId }: MutationAssignRoleArgs,
  { prisma, user }: Context,
) => {
  throwIfNotAdmin(user);

  const result = await prisma.user.update({
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
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  return result;
};
