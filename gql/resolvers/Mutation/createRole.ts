import { Context } from 'libs/types';
import { MutationCreateRoleArgs } from 'libs/types/generated';

export const createRole = async (
  _: unknown,
  { name, description, permissionIds }: MutationCreateRoleArgs,
  { prisma }: Context,
) => {
  const role = await prisma.userDefinedRole.create({
    data: {
      name,
      description,
      ...(permissionIds.length && {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      }),
    },
  });

  return role;
};
