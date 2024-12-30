import { User } from '@/decorators/user.decorator';
import { CustomWsExceptionFilter } from '@/filters/wsException.filter';
import RequestUserInterface from '@/interfaces/request-user.interface';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UploadedFiles,
    UseFilters,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { QueryChatDto } from './dto/query-chat.dto';
import { QueryConversationDto } from './dto/query-conversation.dto';

@ApiTags('Chat')
@Controller('chat')   
export class ChatController{
    constructor(private readonly chatService:ChatService){}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get()
getChat(@Query() query:QueryChatDto){
    return this.chatService.findChat(query);  
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('conversation')
getConversation(@User() user:RequestUserInterface, @Query() query:QueryConversationDto){
    if(query.member)query.members = [new ObjectId(query.member),user._id]
    return this.chatService.findConversation(query);  
}

@Delete('/:chatId')
deleteChat(@Param('chatId') chatId:string ){
    return this.chatService.remove(chatId)
}

}