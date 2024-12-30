import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, STATES } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as paginate from 'mongoose-paginate-v2';
import { STATUS } from '@/enums/status.enum';
import { PARCEL_TYPE, PARCEL_BIDDING_TYPE } from '@/enums/parcel.enum';

export type ParcelDocument = Parcel & Document;

@Schema({
  collection: 'parcels',
  timestamps: true,
})
export class Parcel {
  @Prop({
    type: ObjectId,
    default: function () {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  customer_id: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  rider_id: ObjectId;

  @Prop({
    type: String,
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: string;

    @Prop({
      type: String,
      required: true,
    })
    from_location: string;

    @Prop({
      type: String,
      required: true,
    })
    from_location_cor: string;

    @Prop({
        type:String,
        required:true
    })
    to_location:string

    @Prop({
        type:String,
        required:true
    })
    to_location_cor:string
    
    @Prop({
        type:String,
    })
    height:string
    
    @Prop({
        type:String,
    })
    length:string
    
    @Prop({
        type:String,
    })
    width:string
    
    @Prop({
        type:String,
    })
    weight:string

  @Prop({
    type: String,
    enum: PARCEL_TYPE,
  })
  parcel_type: PARCEL_TYPE;

  @Prop({
    type: String,
  })
  fare: string;

  @Prop({
    type: Date,
  })
  time: Date;

  @Prop({
    type: [String],
  })
  images: [string];

  @Prop({
    type: String,
  })
  pay_amount: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Bid',
  })
  bid: ObjectId;

  @Prop({
    type:String,
    default:function(){
      return Math.floor(10000 + Math.random() * 90000)
    }
  })
  receiving_otp:string;

  @Prop({
    type: Date,
  })
  biddingStartTime: Date;

  @Prop({
    type: Date,
  })
  biddingEndTime: Date;


    @Prop({
      type:String,
    })
    description?:string

    @Prop({
      type:String,
    })
    payment_intent?:string
    
  
  @Prop({
    type: String,
    enum: PARCEL_BIDDING_TYPE,
  })
  bidding_type: PARCEL_BIDDING_TYPE;

  @Prop({
    type:Boolean,
    default:false
  })
  pickup:boolean
  
  
  @Prop({
    type:String
  })
  receiving_slot:String

}

export const parcelSchema = SchemaFactory.createForClass(Parcel);
parcelSchema.plugin(paginate);
