import { 
  WebSocketGateway,
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
} from '@nestjs/websockets';
import {UseGuards, Logger, UseFilters,} from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis'
import { ObjectId } from 'mongodb';
import { Redis } from 'ioredis';
import { WsException } from '@nestjs/websockets';
import { CustomWsExceptionFilter } from '@/filters/wsException.filter';
import { TrackingService } from './tracking.service';


@UseFilters(CustomWsExceptionFilter)
@WebSocketGateway({
  cors:{
    origin:'*'
  }
})
export class TrackingGateway {

  @WebSocketServer()
  server:Server

  private logger : Logger = new Logger('TrackingGateway')
  public readonly redis: Redis;
  constructor(
    private readonly trackingService: TrackingService,
    private readonly redisService: RedisService  
    ) {
    this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);

  }

  async afterInit(){
    this.logger.log('Tracking Init')
  }
  
  @SubscribeMessage('tracking')
  async tracking(@MessageBody() data:any){
    
    let toSocketId = await this.redis.get(data.to)
    await this.redis.rpush(data.parcel,JSON.stringify(data.location))
    data.trail = await this.redis.lrange(data.parcel, 0, -1)
    .then(list => list.map(str => JSON.parse(str)))
    .then(parsedList => parsedList)
    .catch(err => {
      throw new Error(err)
    });
  
    this.server.to(toSocketId as string).emit('tracking',{data})
    if(data.status == 'complete'){
      console.log('entered In check')
      await this.redis.del(data.parcel)
    }
  }
  
  @SubscribeMessage('status-update')
  async statusUpdate(@MessageBody() data:any){
    
    try{let toSocketId = await this.redis.get(data.to)
    
    
    this.server.to(toSocketId as string).emit('status-update',{data})
    }catch(err){
      throw new Error(err)
    };
  }
}
