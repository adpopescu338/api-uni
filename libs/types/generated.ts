export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  _Any: { input: any; output: any };
  _FieldSet: { input: any; output: any };
};

export type ListUsersResponse = {
  __typename?: 'ListUsersResponse';
  nextPage?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Only sysadmins can create permissions */
  createPermissions: Array<Permission>;
  /** Only sysadmins can create roles */
  createRole: UserDefinedRole;
  /** Only sysadmins can create users */
  createUser: User;
  /** Only sysadmins can delete permissions */
  deletePermission: VoidApiResponse;
  /** Only sysadmins can delete roles */
  deleteRole: VoidApiResponse;
  /**
   * Create a session for a user
   * The session ID is returned as a string
   * This needs to be sent in subsequent requests as a header called 'x-session-id'
   */
  login: Scalars['String']['output'];
  /** Only sysadmins can update permissions */
  updatePermissions: Array<Permission>;
  /** Only sysadmins can update roles */
  updateRole: UserDefinedRole;
  /** If you're not sysadmin, you must be authenticated as the user you're trying to update */
  updateUser: User;
};

export type MutationCreatePermissionsArgs = {
  permissions: Array<PermissionInput>;
};

export type MutationCreateRoleArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissionIds: Array<Scalars['ID']['input']>;
};

export type MutationCreateUserArgs = {
  input: UserInput;
};

export type MutationDeletePermissionArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};

export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationUpdatePermissionsArgs = {
  permissions: Array<UpdatePermissionInput>;
};

export type MutationUpdateRoleArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  permissionIds: Array<Scalars['ID']['input']>;
};

export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UserInput;
};

export enum OperationType {
  Create = 'CREATE',
  Delete = 'DELETE',
  Read = 'READ',
  Update = 'UPDATE',
}

export type Permission = {
  __typename?: 'Permission';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  operationTypes: Array<OperationType>;
  resourceName: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PermissionInput = {
  operationTypes: Array<OperationType>;
  resourceName: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  /** Only sysadmins can list users */
  listUsers: ListUsersResponse;
  /**
   * Get the current session details (no user details are returned apart from the user ID)
   * This will return an error if the user is not logged in
   */
  session: Session;
  /** Get the current session and user details */
  sessionAndUser: SessionAndUserResponse;
};

export type QueryListUsersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type SessionAndUserResponse = {
  __typename?: 'SessionAndUserResponse';
  session: Session;
  user: User;
};

export type UpdatePermissionInput = {
  id: Scalars['ID']['input'];
  operationTypes?: InputMaybe<Array<OperationType>>;
  resourceName?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSysAdmin: Scalars['Boolean']['output'];
  roles: Array<UserDefinedRole>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserDefinedRole = {
  __typename?: 'UserDefinedRole';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  isSysAdmin: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type VoidApiResponse = {
  __typename?: 'VoidApiResponse';
  success: Scalars['Boolean']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};
