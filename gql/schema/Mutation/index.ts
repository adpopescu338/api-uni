import { logout } from './logout';
import { login } from './login';

import { createRole } from './createRole';
import { updateRole } from './updateRole';
import { deleteRole } from './deleteRole';

import { createPermissions } from './createPermissions';
import { updatePermissions } from './updatePermissions';
import { deletePermission } from './deletePermission';

import { createUser } from './createUser';
import { updateUser } from './updateUser';

export const Mutation = [
  login,
  logout,

  createRole,
  updateRole,
  deleteRole,

  createPermissions,
  updatePermissions,
  deletePermission,

  createUser,
  updateUser,
];
