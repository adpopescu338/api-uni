import { mergeTypeDefs } from '@graphql-tools/merge';

import { Query } from './Query';
import { Mutation } from './Mutation';
import { User } from './User';
import { Permission } from './Permission';
import { Scalars } from './Scalars';
import { UserDefinedRole } from './UserDefinedRole';
import { VoidApiResponse } from './VoidApiResponse';
import { AuthenticatedTypeDef, SysAdminTypeDef } from 'libs/gql';

export const typesArray = [
  Scalars,
  Query,
  Mutation,
  AuthenticatedTypeDef,
  SysAdminTypeDef,
  User,
  Permission,
  UserDefinedRole,
  VoidApiResponse,
].flat();

export const typeDefs = mergeTypeDefs(typesArray);
