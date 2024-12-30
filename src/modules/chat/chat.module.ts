import { CacheModule, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './entities/chat.entity';
import { Conversation, ConversationSchema } from './entities/conversation.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import UsersModule from '../users/users.module';
import AuthModule from '../auth/auth.module';
import { ChatRepository } from './chat.repository';
import { ChatController } from './chat.controller';
// import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { RedisModule, RedisService } from 'nestjs-redis';
import { CustomWsExceptionFilter } from '@/filters/wsException.filter';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Chat.name,schema:ChatSchema},
      {name:Conversation.name,schema:ConversationSchema}]),
      AuthModule,
      
  ],
  controllers:[ChatController],
  providers: [ChatGateway, ChatService,ChatRepository,
    CustomWsExceptionFilter
  ]
})

export class ChatModule {}
