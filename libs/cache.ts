import { isNil } from 'lodash';
import { Logger } from './logger';
import Redis from 'ioredis';

export class CacheManager {
  private logger: Logger;
  private cache: Redis;
  public cacheKeys = cacheKeys;

  constructor(logger: Logger, connectionString: string) {
    this.logger = logger;
    this.cache = new Redis(connectionString);
  }

  async get<T>(key: string, parse = false): Promise<T | undefined | null> {
    const result = await this.cache.get(key);
    if (isNil(result)) {
      this.logger.debug(`CacheManager: Cache miss for key ${key}`);
      return;
    }

    this.logger.debug(`CacheManager: Cache hit for key ${key}`);

    if (parse) return JSON.parse(result) as T;

    return result as T;
  }

  /**
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Time to live in seconds
   * @returns void
   */
  async set(key: string, value: any, ttl: number = 0) {
    if (isNil(value)) {
      this.logger.debug(`CacheManager: Skipping cache set for key ${key} with NIL value`);
      return;
    }

    if (typeof value === 'object') value = JSON.stringify(value);

    await this.cache.set(key, value, 'EX', ttl);
    this.logger.debug(`CacheManager: Cache set for key ${key} with TTL ${ttl}`);
  }

  async del(key: string) {
    await this.cache.del(key);
    this.logger.debug(`CacheManager: Cache deleted for key ${key}`);
  }

  async deleteByPattern(pattern: string) {
    const keys = await this.cache.keys(pattern);
    if (keys.length > 0) {
      await this.cache.del(...keys);
      this.logger.debug(`CacheManager: Cache deleted for keys ${keys.join(', ')}`);
    }
  }
}

const cacheKeys = {
  session: {
    full: (sessionId: string, userId: string) => `session::${sessionId}::${userId}`,
    bySessionId: (sessionId: string) => `session::${sessionId}::*`,
    byUserId: (userId: string) => `session::*::${userId}`,
  },
  usersCount: 'users::count',
};
