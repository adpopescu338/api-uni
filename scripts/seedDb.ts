import { getHashedPassword } from '../libs/getHashedPassword';
import { config } from 'dotenv';
import { getLogger } from '../libs/logger';
import { times, random, sampleSize } from 'lodash';
import { faker } from '@faker-js/faker';
import { client } from 'prisma/client';
import { OperationType } from '@prisma/client';

const DEFAULT_PASSWORD = 'password';
const SYS_ADMIN_EMAIL = 'sysadmin@mail.com';

config();

const logger = getLogger('debug');

const seed = async () => {
  const password = await getHashedPassword(DEFAULT_PASSWORD);

  const users = [
    // normal users
    ...times(10, () => {
      return client.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password,
          isSysAdmin: false,
          roles: {
            create: times(random(1, 3), () => {
              return {
                name: faker.name.jobTitle(),
                description: faker.lorem.sentence(),
                permissions: {
                  createMany: {
                    data: times(random(1, 3), () => {
                      return {
                        resourceName: faker.person.jobTitle(),
                        operationTypes: sampleSize(Object.values(OperationType)) as OperationType[],
                      };
                    }),
                  },
                },
              };
            }),
          },
        },
      });
    }),
    // sys admin
    client.user.create({
      data: {
        name: 'System Admin',
        email: SYS_ADMIN_EMAIL,
        password,
        isSysAdmin: true,
      },
    }),
  ];

  await client.$transaction(users);

  logger.info('Users seeded successfully');
};

seed();
