import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export type ProfileDocument = Profile & Document;

@Schema({
  collection: 'profiles',
  timestamps: true,
})
export class Profile {
  @ApiProperty()
  @Prop({
    type: ObjectId,
    default: () => {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    required: true,
    index: true,
    type: ObjectId,
  })
  user_id: ObjectId;

  @Prop({
    required: true,
    index: true,
    type: String,
  })
  license: string;

  @ApiProperty({ type: Array })
  @Prop({
    required: true,
    index: true,
    type: String,
  })
  id_card: string

  @Prop({
    required: true,
    index: true,
    type: String,
  })
  approved_by:string

  @Prop({
    required: true,
    index: true,
    type: String,
  })
  status:string

  @Prop({
    required: true,
    index: true,
    type: String,
  })
  about: string;

  @Prop({
    index: true,
    type: String,
  })
  video_link: string;

  @Prop({
    index: true,
    type: String,
    default: '$100',
  })
  rate: string;

  @Prop({
    index: true,
    type: String,
    default: '/60',
  })
  time_duration: string;

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
