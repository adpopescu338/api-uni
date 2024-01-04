import { describe, it, expect, jest } from '@jest/globals';
import { deletePermission } from '../../gql/resolvers/Mutation/deletePermission';

const ctx = {
  prisma: {
    permission: {
      delete: jest.fn(),
    },
  },
  user: {
    isSysAdmin: true,
  },
} as any;

describe('deletePermission', () => {
  it('Should be defined', () => {
    expect(deletePermission).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      deletePermission(undefined, { id: '' }, { user: { isSysAdmin: false } } as any),
    ).rejects.toThrowError();
  });

  it('Should throw an error if permission is not found', async () => {
    await expect(deletePermission(undefined, { id: 'id' }, ctx)).rejects.toThrowError();
  });

  it('Should delete the permission and return success: true', async () => {
    ctx.prisma.permission.delete.mockResolvedValue({ id: 'id' } as never);

    const result = await deletePermission(undefined, { id: 'id' }, ctx);
    const { lastCall } = ctx.prisma.permission.delete.mock;

    expect(result).toEqual({ success: true });
    expect(lastCall).toMatchSnapshot();
  });
});
