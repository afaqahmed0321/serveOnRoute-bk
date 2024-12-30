import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { STATUS } from '../../../enums/status.enum';
import mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type ComplaintDocument = Complaint & Document;

@Schema({
  collection: 'complaints',
  timestamps: true,
})
export class Complaint {
  @Prop({
    type: ObjectId,
    default: () => {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required:true
  })
  complainant: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  complain_against: string;

  @Prop({
    type: Object,
  })
  complainant_proof: {
    images: [];
    description: string;
  };

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcel',
  })
  parcel: ObjectId;

  @Prop({
    type: Object,
  })
  defendant_proof: {
    images: [];
    description: string;
  };

  @ApiProperty()
  @Prop({
    type: String,
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: STATUS[];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
ComplaintSchema.plugin(paginate);
