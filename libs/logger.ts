import pino, { Level } from 'pino';

export const getLogger = (level?: Level) => {
  return pino({
    transport: {
      target: 'pino-pretty',
    },
    level: level || process.env.LOG_LEVEL || 'info',
  });
};

export type Logger = ReturnType<typeof getLogger>;
