import { describe, it, expect, jest } from '@jest/globals';
import { createRole } from '../../gql/resolvers/Mutation/createRole';

const payload = {
  name: 'name',
  description: 'description',
  permissionIds: ['id'],
};

describe('createRole', () => {
  it('Should be defined', () => {
    expect(createRole).toBeDefined();
  });

  it('Should throw an error if user is not system admin', async () => {
    await expect(
      createRole(undefined, payload, { user: { isSysAdmin: false } } as any),
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
          create: jest.fn().mockResolvedValue(expectedResult as never),
        },
      },
      user: {
        isSysAdmin: true,
      },
    } as any;

    const result = await createRole(undefined, payload, ctx);
    const { lastCall } = ctx.prisma.userDefinedRole.create.mock;

    expect(result).toEqual(expectedResult);
    expect(lastCall).toMatchSnapshot();
  });
});
