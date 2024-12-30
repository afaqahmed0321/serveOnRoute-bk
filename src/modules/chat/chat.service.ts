import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { ChatRepository } from './chat.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { QueryConversationDto } from './dto/query-conversation.dto';
import { QueryChatDto } from './dto/query-chat.dto';
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService:AuthService,
    private readonly chatRepository:ChatRepository
    ){}

  async createChat(createChatDto: CreateChatDto) {
    if(!createChatDto.conversationId){
      let conversation = await this.chatRepository.createConversation({
        members:[createChatDto.sender, new ObjectId(createChatDto.to)],
        parcel:new ObjectId(createChatDto.parcel as string)
      })
      createChatDto.conversationId = conversation._id
    }
    return await this.chatRepository.createChat(createChatDto);
  }

  async createConversation(createConversationDto: CreateConversationDto) {
    return this.chatRepository.createConversation(createConversationDto);
  }
  
  async findConversation(getConversationBody: QueryConversationDto) {
    console.log("Service",getConversationBody)
    
    return await this.chatRepository.findConversation(getConversationBody);
  }

  findChat(query:QueryChatDto) {
    const filter = _.pick(query,['conversationId','message','sender'])
    const options = _.pick(query,['page','limit','sort','populate'])
    return this.chatRepository.getChat(filter,options);
  }

  async getUserFromSocket(socket: Socket) {
    const token = socket.handshake.headers?.authorization as string;
    // const { Authentication: authenticationToken } = parse(cookie) ;
    const user = await this.authService.getUserFromAuthenticationToken(token);

    return user;
  }

  async findAll(body:any){
    return await this.chatRepository.findChat(body)
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  remove(id: string) {
    return this.chatRepository.deleteChat(id);
  }
}
