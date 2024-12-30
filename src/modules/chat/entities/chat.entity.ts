import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import * as paginate from "mongoose-paginate-v2";

export type ChatDocument = Chat & Document

@Schema({
    collection:'messages',
    timestamps:{
        createdAt:true
    }
})
export class Chat {
    @Prop({
        type:String
    })
    conversationId:string
    
    @Prop({
        type:String
    })
    message:string
    
    @Prop({
        type:String
    })
    sender:string

}
export const ChatSchema = SchemaFactory.createForClass(Chat)
ChatSchema.plugin(paginate)
