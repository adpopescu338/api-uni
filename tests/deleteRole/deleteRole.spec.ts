import { describe, it, expect, jest } from '@jest/globals';
import { deleteRole } from '../../gql/resolvers/Mutation/deleteRole';

const ctx = {
  prisma: {
    userDefinedRole: {
      delete: jest.fn(),
    },
  },
  user: {
    isSysAdmin: true,
  },
} as any;

describe('deleteRole', () => {
  it('Should be defined', () => {
    expect(deleteRole).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      deleteRole(undefined, { id: '' }, { user: { isSysAdmin: false } } as any),
    ).rejects.toThrowError();
  });

  it('Should throw an error if the role is not found', async () => {
    await expect(deleteRole(undefined, { id: 'id' }, ctx)).rejects.toThrowError();
  });

  it('Should delete the role and return success: true', async () => {
    ctx.prisma.userDefinedRole.delete.mockResolvedValue({ id: 'id' } as never);

    const result = await deleteRole(undefined, { id: 'id' }, ctx);
    const { lastCall } = ctx.prisma.userDefinedRole.delete.mock;

    expect(result).toEqual({ success: true });
    expect(lastCall).toMatchSnapshot();
  });
});
