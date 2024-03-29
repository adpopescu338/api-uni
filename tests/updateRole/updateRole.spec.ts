import { describe, it, expect, jest } from '@jest/globals';
import { updateRole } from 'gql/resolvers/Mutation/updateRole';

const payload = {
  id: 'id',
  name: 'name',
  description: 'description',
  permissionIds: ['id'],
};

describe('updateRole', () => {
  it('Should be defined', () => {
    expect(updateRole).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      updateRole(undefined, payload, { user: { isSysAdmin: false } } as any),
    ).rejects.toThrowError();
  });

  it('Should save the correct data and return the role', async () => {
    const expectedResult = {
      id: 'id',
      name: 'name',
      description: 'description',
    };

    const ctx = {
      prisma: {
        userDefinedRole: {
          update: jest.fn().mockResolvedValue(expectedResult as never),
        },
      },
      user: {
        isSysAdmin: true,
      },
    } as any;

    const result = await updateRole(undefined, payload, ctx);
    const { lastCall } = ctx.prisma.userDefinedRole.update.mock;

    expect(result).toEqual(expectedResult);
    expect(lastCall).toMatchSnapshot();
  });
});
