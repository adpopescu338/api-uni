import { describe, it, expect, jest } from '@jest/globals';
import { assignRole } from 'gql/resolvers/Mutation/assignRole';

const payload = {
  roleId: '123',
  userId: '456',
};

describe('assignRole', () => {
  it('Should be defined', () => {
    expect(assignRole).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      assignRole(undefined, payload, { user: { isSysAdmin: false } } as any),
    ).rejects.toThrowError();
  });

  it('Should save the correct data and return the role', async () => {
    const expectedResult = {
      id: '456',
      name: 'name',
      roles: [
        {
          id: '123',
          name: 'name',
          description: 'description',
          permissions: [],
        },
      ],
    };

    const ctx = {
      prisma: {
        user: {
          update: jest.fn().mockResolvedValue(expectedResult as never),
        },
      },
      user: {
        isSysAdmin: true,
      },
    } as any;

    const result = await assignRole(undefined, payload, ctx);
    const { lastCall } = ctx.prisma.user.update.mock;

    expect(result).toEqual(expectedResult);
    expect(lastCall).toMatchSnapshot();
  });
});
