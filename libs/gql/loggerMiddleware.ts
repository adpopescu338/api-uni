import { Request, Response, NextFunction } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { Logger } from '../logger';
import { Context } from '../types';
import os from 'os';
import * as oldOs from 'os';

// this middleware works before apollo server context creation
export const logExpressMiddleware =
  (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
    const method = () => req.method;
    const url = () => req.originalUrl;
    const hostName = () => req.hostname || '';
    const ipAddress = () => req.headers?.['x-forwarded-for'] as string;
    const environment = () =>
      `${os?.hostname() || oldOs?.hostname()} ${os?.platform() || oldOs?.platform()} ${
        os?.type() || oldOs?.type()
      }`;

    const logInfo = {
      environment: environment(),
      utcTime: new Date().toISOString(),
      hostName: hostName(),
      method: `${method()}`,
      path: `${url()}`,
      ipAddress: ipAddress(),
    };

    const query = req.body.query?.trim();

    if (!query) {
      next();
    } else {
      logger.info(`Request ${JSON.stringify(logInfo)}, query -- `, query);
      next();
    }
  };

// this middleware works after apollo server context creation
export const logGqlMiddleware =
  (logger: Logger) =>
  async (
    resolve: (root: any, args: any, context: Context, info: GraphQLResolveInfo) => Promise<any>,
    root: any,
    args: any,
    context: Context,
    info: GraphQLResolveInfo,
  ) => {
    // Here we can log the GraphQL request
    // and store any metrics or debug information

    // logger.debug(`GraphQL args:`, args);
    // logger.debug(`GraphQL info.fieldName:`, info.fieldName);
    // logger.debug(`GraphQL info.fieldNodes:`, info.fieldNodes);
    // logger.debug(`GraphQL info.operation:`, info.operation.name);
    // logger.debug(`GraphQL info.parentType:`, info.parentType);
    // logger.debug(`GraphQL info.path:`, info.path);
    // logger.debug(`GraphQL info.returnType:`, info.returnType);

    const result = await resolve(root, args, context, info);
    return result;
  };
