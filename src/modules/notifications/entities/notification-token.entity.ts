import { STATUS } from '@/enums/status.enum';
import {Schema,SchemaFactory,Prop} from '@nestjs/mongoose'
import { ObjectId } from 'mongodb';
import { Document,Schema as MongooseSchema } from "mongoose";

export type NotificationTokenDocument = NotificationToken & Document

@Schema({
    collection:'notification-tokens',
    timestamps:true
})
export class NotificationToken{
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
    device_type:string

    @Prop({
        type:String
    })
    notification_token:string

    @Prop({
        type:MongooseSchema.Types.ObjectId,
        ref:'User'
    })
    user: ObjectId

    @Prop({
        type:String,
        default:STATUS.ACTIVE
    })
    status:string

    @Prop({
        type:Array,
        default:["user"]
    })
    role:[string]
}

export const notificationTokenSchema = SchemaFactory.createForClass(NotificationToken)
