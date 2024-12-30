import { Schema,SchemaFactory,Prop } from "@nestjs/mongoose"
import { ObjectId } from "mongodb"
import {Document, Schema as MongooseSchema} from 'mongoose'
import * as paginate  from "mongoose-paginate-v2"

export type BidDocument = Bid & Document

@Schema({
    collection: 'Bids',
    timestamps: true,
  })
export class Bid {

    @Prop({
        type:ObjectId,
        default: ()=> new ObjectId()
    })
    _id:ObjectId

    @Prop({
        type:String
    })
    bid_amount:string

    @Prop({
        type:MongooseSchema.Types.ObjectId,
        ref:'Parcel'
    })
    parcel:ObjectId

    @Prop({
        type:MongooseSchema.Types.ObjectId,
        ref:'User'
    })
    bidder:ObjectId

    @Prop({
        type:String
    })
    description:string

}

export const BidSchema = SchemaFactory.createForClass(Bid)
BidSchema.plugin(paginate)