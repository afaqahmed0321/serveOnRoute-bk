import {Schema,SchemaFactory,Prop} from '@nestjs/mongoose'
import { ObjectId } from 'mongodb';
import { Document, Schema as MongooseSchema } from "mongoose";
import * as paginate  from 'mongoose-paginate-v2';

export type NotificationDocument = Notification & Document

@Schema({
    collection:'notifications',
    timestamps:true
})
export class Notification{
    @Prop({
        type:ObjectId,
        default:function(){
            return new ObjectId()
        }
    })
    _id:ObjectId

    @Prop({
        type:String
    })
    title:string

    @Prop({
        type:String
    })
    body:string

    @Prop({
        type:MongooseSchema.Types.ObjectId,
        ref:'User'
    })
    user: ObjectId

    @Prop({
        type:String
    })
    type:string

    @Prop({
        type:String
    })
    notification_token:string

    @Prop({
        type:Boolean,
        default:false
    })
    is_read:boolean
}

export const notificationSchema = SchemaFactory.createForClass(Notification)
notificationSchema.plugin(paginate)
