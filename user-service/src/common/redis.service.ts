import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: any; // avoid RedisClientType if types missing
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = createClient({ url });
    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));
    await this.client.connect();
    this.logger.log(`Connected to Redis at ${url}`);
  }

  async onModuleDestroy() {
    await this.client?.disconnect();
    this.logger.log('Disconnected from Redis');
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    return await this.client.del(key);
  }
}