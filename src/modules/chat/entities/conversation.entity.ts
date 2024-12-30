import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";

export type ConversationDocument = Conversation & Document

@Schema({
    collection:'conversations',
    timestamps:true
})
export class Conversation{
    @Prop({
        type:ObjectId,
        default:()=>{
            return new ObjectId()
        }
    })
    _id:ObjectId

    @Prop({
        type:Array
    })
    members:[ObjectId]

    @Prop({
        type:ObjectId
    })
    parcel:ObjectId
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)