import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import * as paginate from 'mongoose-paginate-v2';

class Location{
    @Prop({
        type:String,
        required:true,
        default:'Point',
      })
      type:string
      
    @Prop({
        type:[String],
        required:true,
        index:'2dsphere'
      })
      coordinates:[string]

}

export type WaypointDocument = Waypoint & Document;

@Schema({
  collection: 'Waypoints',
  timestamps: true,
})
export class Waypoint {
  @ApiProperty()
  @Prop({
    type: ObjectId,
    default: () => {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    type:MongooseSchema.Types.ObjectId,
    required:true,
    ref:'Route'
  })
  route:ObjectId
  
  @Prop({
    type:Location,
  })
  location:Location
  

}

export const WaypointSchema = SchemaFactory.createForClass(Waypoint);
WaypointSchema.plugin(paginate)
WaypointSchema.index({ location : '2dsphere' });