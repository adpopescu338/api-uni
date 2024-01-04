/**
 * To be used with GQL field resolvers. It will ensure that your fields resolver has the corresponding name in the Model, and that it returns the correct type.
 */
export type GQLResolver<T> = Partial<{
  [K in keyof T]: (
    parent: T,
    args: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    info: unknown,
  ) => Maybe<T[K] | Promise<T[K]>>;
}>;

type Maybe<T> = T | null | undefined;