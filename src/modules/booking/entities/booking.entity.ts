import { Schema,SchemaFactory,Prop } from "@nestjs/mongoose"
import { ObjectId } from "mongodb"
import {Document, Schema as MongooseSchema} from 'mongoose'
import * as paginate  from "mongoose-paginate-v2"

export type BookingDocument = Booking & Document

@Schema({
    collection: 'Bookings',
    timestamps: true,
  })
export class Booking {

    @Prop({
        type:ObjectId,
        default: ()=> new ObjectId()
    })
    _id:ObjectId

    
   
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
BookingSchema.plugin(paginate)