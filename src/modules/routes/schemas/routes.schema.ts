import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import * as paginate from 'mongoose-paginate-v2';
import { DAYS } from '@/enums/days.enum';

export type RouteDocument = Route & Document;

@Schema({
  collection: 'Routes',
  timestamps: true,
})
export class Route {
  @ApiProperty()
  @Prop({
    type: ObjectId,
    default: () => {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    type:String,
    required:true
  })
  from_cord:string
  
  @Prop({
    type:String,
    required:true
  })
  from:string
  
  @Prop({
    type:String,
    required:true
  })
  to_cord:string
  
  @Prop({
    type:String,
    required:true
  })
  to:string
  
  @Prop({
    type:Boolean,
    required:true
  })
  has_diversion:boolean
  
  @Prop({
    type:Date,
  })
  start_time:Date

  @Prop({
    type:Date,
  })
  end_time:Date

  @Prop({
     type: MongooseSchema.Types.ObjectId,
     ref:'User' 
    })
  rider:string

  @Prop({
     type: [{type:String,enum:DAYS,default:[]}],
    })
  schedule:DAYS[]

  @Prop({
     type: Boolean, 
     default:true
    })
  isActive:boolean

  // @Prop({
  //   type: {
  //     type: String,
  //     enum: ['LineString'],
  //     required: true,
  //   },
  // })
  // type: 'LineString';

  // @Prop({ type: [[Number]], index: '2dsphere' })
  // waypoints: number[][];

}

export const RouteSchema = SchemaFactory.createForClass(Route);
RouteSchema.plugin(paginate)