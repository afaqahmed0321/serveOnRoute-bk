import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis'

@Injectable()
export class RedisFlushService implements OnApplicationShutdown{
    constructor(private readonly redisService:RedisService){}
        
    async onApplicationShutdown(signal?: string) {
        const client = this.redisService.getClient();
        await client.flushdb();
        console.log('Redis-FLUSHED');
    }
    
}