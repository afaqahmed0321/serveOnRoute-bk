import { 
    WebSocketGateway,
    SubscribeMessage, 
    MessageBody, 
    WebSocketServer,
  } from '@nestjs/websockets';
  import {UseGuards, Logger, UseFilters, Inject,} from '@nestjs/common'
  import { Server, Socket } from 'socket.io'
  import { Redis } from 'ioredis';
  import { WsException } from '@nestjs/websockets';
  import { CustomWsExceptionFilter } from '@/filters/wsException.filter';
  import { BidService } from './bid.service';
import { ParcelService } from '../parcel/parcel.service';
import {RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis'

import { UsersService } from '../users/users.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NOTIFICATION_TYPE } from '@/enums/notification.enum';
  
  
  @UseFilters(CustomWsExceptionFilter)
  @WebSocketGateway({
    cors:{
      origin:'*'
    }
  })
  export class BidGateway {
  
    @WebSocketServer()
    server:Server
  
    private logger : Logger = new Logger('BiddingGateway')
    public readonly redis: Redis;
    constructor(
        private readonly redisService:RedisService ,
        private readonly biddingService: BidService,
        private readonly parcelService: ParcelService,
        private readonly notificationService:NotificationsService
        // private readonly usersService: UsersService,
        ) {
          this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
        }
  
    async afterInit(){
      this.logger.log('Bidding Init')
    }
    
    @SubscribeMessage('bidding')
    async bidding(@MessageBody() data:CreateBidDto){
        let parcel : any = await this.parcelService.findOne(data.parcel)
        if(!parcel){
          let riderSocketId = await this.redis.get(data.bidder)
          this.server.to(riderSocketId as string).emit('exception',`Parcel with Id ${data.parcel} not exist`);
        }else{

          let toSocketId = await this.redis.get(parcel.customer_id._id as string)
          console.log("FOR CUSTOMER_ID>>>",parcel.customer_id._id as string,"CustomerSocket?>>>>>>>",toSocketId);
            let bid = await this.biddingService.create(data)
            let bidDetails : any = await this.biddingService.findOneAndPopulate(bid._id)
            let body = {title:'Bid Created on Parcel!',body:`Rider with Id: ${data.bidder} has been bid on your parcel ${parcel}`}
            await this.notificationService.sendNotification({user:bidDetails?.parcel?.customer_id as unknown as string,title:body.title,body:body.body,type:NOTIFICATION_TYPE.BID_CREATED})
            console.log("Details>>>>>>>.",bidDetails);
          this.server.to(toSocketId as string).emit('bidding',bidDetails)
        }
    }
  }