import { Prisma } from '@prisma/client';

export const userIncludeRolesAndPermissions = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    roles: {
      include: {
        permissions: true,
      },
    },
  },
});

export type UserIncludeRolesAndPermissions = Prisma.UserGetPayload<
  typeof userIncludeRolesAndPermissions
>;
