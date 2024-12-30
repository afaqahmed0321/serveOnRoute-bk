import { 
  WebSocketGateway,
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
 } from '@nestjs/websockets';
import {UseGuards, Logger, UseFilters, OnModuleInit, OnModuleDestroy, BadRequestException,WsExceptionFilter} from '@nestjs/common'
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io'
import { ConnectedSocket } from '@nestjs/websockets/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import ConnectedUser from './interface/connectedUser.interface';
// import { CustomWsExceptionFilter } from '@/filters/wsException.filter';
import {RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis'
// import {RedisService } from 'nestjs-redis'
import { ObjectId } from 'mongodb';
import { Redis } from 'ioredis';
// import { User } from '@/decorators/user.decorator';
import { WsException } from '@nestjs/websockets';
import { CustomWsExceptionFilter } from '@/filters/wsException.filter';

@WebSocketGateway({
  cors:{
    origin:'*'
  }
}) 
@UseFilters(CustomWsExceptionFilter)
export class ChatGateway{

  @WebSocketServer()
  server:Server
  private logger : Logger = new Logger('ChatGateway')
  public readonly redis: Redis;
  constructor(
    private readonly chatService: ChatService,
    private readonly redisService: RedisService
    ) {
      this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
    }
  
  async afterInit(){
    await this.redis.del("connectedUsers")
    this.logger.log('ChatGateway Init With Flush Redis')
  }

  
  async handleConnection(socket:Socket) {
    const token = socket.handshake.headers?.authorization;
    if(!token){
      this.server.emit('exception','Token Not Found!')
      socket.disconnect()
      
    }
    let user = await this.chatService.getUserFromSocket(socket); 
    if(!user){
      this.logger.log("User not get from passed token!")
      this.server.emit('exception','User Not Found with that token')
      socket.disconnect()
          // throw new WsException('Invalid credentials.');
    }else{
      user.socketId = socket.id
      // const checklist = await this.redis.lrange('connectedUsers',0,-1)
      // const filteredUser = checklist.filter((obj) => JSON.parse(obj)["userId"] == user._id);
      // if (filteredUser){
      //   throw new WsException('User already connected!')
      // }
      await this.redis.rpush('connectedUsers',JSON.stringify(user))
      console.log("userId>>",user._id as string,"    Socket Id>>>",user.socketId);
      await this.redis.set(`${user._id}` as string,user.socketId);
      let list = await this.redis.lrange("connectedUsers",0,-1)
      this.server.sockets.emit('connectedUsers', list.map((str)=>JSON.parse(str)))
      this.logger.log("ONCONNECTION",)  
    }
  }
  
  



  // async handleConnection(socket:Socket){
  //   this.logger.log(socket.id)
  // }

  

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto,  ) {
    return this.chatService.createChat(createChatDto);
  }

  // @UseFilters(new CustomWsExceptionFilter)
  @SubscribeMessage('send_message')
  async listenForMessages(
          @MessageBody() data: any,
          @ConnectedSocket() socket:Socket
          ) {
            try{
              let user = await this.chatService.getUserFromSocket(socket);
              data.sender = user?._id 
              let toSocketId = await this.redis.get(data.to)
              console.log(toSocketId);
              console.log("DATA",data);
              // let touser:any = this.users.filter((elem:any) => elem.socketId == data.socketId)
              let chat = await this.chatService.createChat(data)
              console.log("CHAT",chat);
              data.to = toSocketId
              data.conversationId = chat.conversationId
              this.server.to(toSocketId as string).emit('receive_message',chat)
              this.logger.log("MESSAGE_SENT")
              return 'message sent!'
            }catch(err){
      console.log(err);
    }
  }

  @SubscribeMessage('findAllChat')
  findAll(@MessageBody() body:any ) {
    return this.chatService.findAll(body);
  }
  
  // @SubscribeMessage('typing')
  // typing() {
  //   // return this.chatService.findAll();
  // }


  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
  async  handleDisconnect(socket: Socket) {
    this.logger.log("ON DISCONNECT");
    const list = await this.redis.lrange('connectedUsers',0,-1)
    console.log("SocketId---->",socket.id)
    const filteredList = list.filter((obj) => JSON.parse(obj)["socketId"] !== socket.id);
    console.log("FilteredLIST---->",filteredList)
    await this.redis.del("connectedUsers")
    if(filteredList.length)await this.redis.rpush("connectedUsers", ...filteredList)
    console.log("Redis Finally---->",await this.redis.lrange('connectedUsers',0,-1))

    this.server.sockets.emit('connectedUsers',await this.redis.lrange('connectedUsers',0,-1))
  }

}