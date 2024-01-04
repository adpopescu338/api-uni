import { describe, it, expect, jest } from '@jest/globals';
import { updatePermissions } from '../../gql/resolvers/Mutation/updatePermissions';
import { OperationType, UpdatePermissionInput } from 'libs/types/generated';

describe('updatePermissions', () => {
  it('Should be defined', () => {
    expect(updatePermissions).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      updatePermissions(undefined, { permissions: [] }, { user: { isSysAdmin: false } } as any),
    ).rejects.toThrowError();
  });

  it('Should save the correct data and return the permissions', async () => {
    const permissions: UpdatePermissionInput[] = [
      {
        id: 'id',
        resourceName: 'someResource',
        operationTypes: [OperationType.Read],
      },
    ];

    const ctx = {
      prisma: {
        permission: {
          update: jest.fn(),
        },
        $transaction: jest.fn().mockResolvedValue(permissions as never),
      },
      user: {
        isSysAdmin: true,
      },
    } as any;

    const result = await updatePermissions(undefined, { permissions }, ctx);
    const { lastCall } = ctx.prisma.permission.update.mock;

    expect(result).toEqual(permissions);
    expect(lastCall).toMatchSnapshot();
  });
});
