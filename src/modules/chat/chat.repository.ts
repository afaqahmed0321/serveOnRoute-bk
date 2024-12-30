import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model, PaginateModel } from "mongoose";
import { Chat, ChatDocument } from "./entities/chat.entity";
import { Conversation, ConversationDocument } from "./entities/conversation.entity";
import { BadRequestException } from "@nestjs/common/exceptions";

export class ChatRepository{
    constructor(
        @InjectModel(Chat.name) private readonly ChatModel:Model<ChatDocument>,
        @InjectModel(Chat.name) private readonly ChatModelPag:PaginateModel<ChatDocument>,
        @InjectModel(Conversation.name) private readonly ConversationModel:Model<ConversationDocument>,
    ){}

    async createChat(data:any){
        return await this.ChatModel.create(data)
    }

    async updateChat(chatId:string,data:any){
        return await this.ChatModel.findOneAndUpdate({_id:new ObjectId(chatId)},data,{new:true})
    }

    // async getChat(filter:any,options:any){
    //     return await this.ChatModel.aggregate([
    //         {
    //         $match:{
    //             conversationId:filter.conversationId    
    //         }
    //     },
    //     {
    //         $project:{"$$ROOT":1}
    //     },
    //     {
    //         $sort:{
    //             createdAt:1
    //         }
    //     },{
    //         $limit:filter.limit
    //     }
    // ])
    // }
    async getChat(filter:any,options:any){
        return await this.ChatModelPag.paginate(filter,options)
    }

    async deleteChat(chatId:string){
        return await this.ChatModel.findOneAndDelete({_id:new ObjectId(chatId)})
    }

    async findChat(filter:any){
        return await this.ChatModel.find(filter);
    }

    async createConversation(data:any){
        return await this.ConversationModel.create(data)
    }
    
    async findConversation(data:any){
        let conversation;
        if(data.members){
            conversation = await this.ConversationModel.findOne({members:{$all:data.members}})
        }
        else if(data.parcel){
            conversation = await this.ConversationModel.findOne({parcel:new ObjectId(data.parcel)})
        }
        console.log(conversation);
        if(!conversation){
            throw new BadRequestException('No Conversation Exists with that members')
        }
        return conversation;
    }

    async deleteConversation(conversationId:string){
        return await this.ConversationModel.findOneAndDelete({_id:new ObjectId(conversationId)})
    }

}