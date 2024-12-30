import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

export type PayoutDocument = Payout & Document;

@Schema({
  collection: 'payouts',
  timestamps: true,
})
export class Payout {
  @Prop({
    type: ObjectId,
    default: function () {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: ObjectId;

  @Prop({
    type: Number,
  })
  amount: number;
  @Prop({
    type: String,
  })
  payoutId: string;
}

export const payoutSchema = SchemaFactory.createForClass(Payout);
