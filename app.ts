import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginUsageReportingDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import * as util from 'util';
import { GraphQLSchema } from 'graphql';
import { typeDefs } from './gql/schema';
import { resolvers } from './gql/resolvers';
import { Context } from './libs/types';
import express from 'express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { buildContext, logExpressMiddleware, logGqlMiddleware } from './libs/gql';
import { applyMiddleware } from 'graphql-middleware';
import { getLogger, Logger } from './libs/logger';
import { CacheManager } from './libs/cache';
import { config } from 'dotenv';
import { Level } from 'pino';
import { client as prisma } from './prisma/client';

class Main {
  private logger: Logger;
  private production;
  private port;
  private cacheManager: CacheManager;

  constructor() {
    config();
    this.logger = getLogger(process.env.LOG_LEVEL as Level);

    this.production = process.env.NODE_ENV === 'production';
    this.port = process.env.PORT || 3000;
    this.cacheManager = new CacheManager(this.logger, process.env.REDIS_CONNECTION_URL as string);
  }

  public async initialise() {
    this.setupProcessErrorHandlers();

    const schemaWithMiddleware = this.generateGraphQLSchema();

    const apolloServer = await this.generateApolloServer(schemaWithMiddleware);

    this.launchExpress(apolloServer);
  }

  private setupProcessErrorHandlers() {
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      promise.catch((err) => {
        this.logger.fatal('Unhandled Rejection', `Unhandled Rejection: ${err}, reason: ${reason}`);
      });
    });

    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught Exception:', error.message, error);
    });
  }

  private generateGraphQLSchema(): GraphQLSchema {
    const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

    // TODO: Add custom directives here

    const schemaWithMiddleware = applyMiddleware(schema, logGqlMiddleware(this.logger));

    return schemaWithMiddleware;
  }

  private async generateApolloServer(schemaWithMiddleware: GraphQLSchema): Promise<ApolloServer> {
    const server = new ApolloServer({
      schema: schemaWithMiddleware,
      introspection: true,
      formatError: (error) => {
        if (error?.extensions?.code !== 'UNAUTHENTICATED') {
          this.logger.debug(
            'GraphQLError',
            util.inspect(error, { showHidden: false, depth: null }),
          );
          this.logger.error(error);
        }

        // TODO: Add error handling here
        // If a known error, return the error
        // Else mask the error and return a generic error message to hide internal details
        return error;
      },
      plugins: [
        ApolloServerPluginUsageReportingDisabled(),
        ApolloServerPluginInlineTrace({
          includeErrors: {
            transform(err) {
              return err?.extensions?.code === 'UNAUTHENTICATED' ||
                err?.extensions?.code === 'PRIVATE_ONLY_FIELD'
                ? null
                : err;
            },
          },
        }),
        ApolloServerPluginLandingPageLocalDefault()
        // TODO: Uncomment the code below when deploying to prod
        // !this.production
        //   ? ApolloServerPluginLandingPageLocalDefault()
        //   : ApolloServerPluginLandingPageProductionDefault(),
      ],
    });

    await server.start();

    return server;
  }

  private launchExpress(apolloServer: ApolloServer) {
    const app = express();
    app.use(express.json());
    app.use(logExpressMiddleware(this.logger));

    app.use(
      '/',
      expressMiddleware(apolloServer, {
        context: async ({ req }): Promise<Context> => {
          return buildContext(req, {
            prisma,
            cacheManager: this.cacheManager,
            logger: this.logger,
          });
        },
      }),
    );

    app.listen({ port: this.port }, () => {
      this.logger.info(`🚀 GRAPHQL ready at http://localhost:${this.port}`);
    });
  }
}

new Main().initialise().catch((err) => {
  console.error(`❗️ Failed to launch graphql server`, err);
});
