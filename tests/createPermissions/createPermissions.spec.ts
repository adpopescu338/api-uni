import { describe, it, expect, jest } from '@jest/globals';
import { createPermissions } from 'gql/resolvers/Mutation/createPermissions';
import { OperationType, PermissionInput } from 'libs/types/generated';

describe('createPermissions', () => {
  it('Should be defined', () => {
    expect(createPermissions).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      createPermissions(undefined, { permissions: [] }, { user: { isSysAdmin: false } } as any),
    ).rejects.toThrowError();
  });

  it('Should save the correct data and return the permissions', async () => {
    const permissions: PermissionInput[] = [
      {
        resourceName: 'someResource',
        operationTypes: [OperationType.Read],
      },
    ];

    const expectedResult = [
      {
        id: 'id',
        ...permissions[0],
      },
    ];

    const ctx = {
      prisma: {
        permission: {
          createMany: jest.fn().mockResolvedValue(expectedResult as never),
        },
      },
      user: {
        isSysAdmin: true,
      },
    } as any;

    const result = await createPermissions(undefined, { permissions }, ctx);
    const { lastCall } = ctx.prisma.permission.createMany.mock;

    expect(result).toEqual(expectedResult);
    expect(lastCall).toMatchSnapshot();
  });
});
