import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as paginate from 'mongoose-paginate-v2';
import { STATUS } from '@/enums/status.enum';

export type TransactionDocument = Transaction & Document;

@Schema({
  collection: 'transactions',
  timestamps: true,
})
export class Transaction {
  @Prop({
    type: ObjectId,
    default: function () {
      return new ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    // required:true,
    ref: 'User',
  })
  user: ObjectId;

  @Prop({
    type: String,
    enum: STATUS,
  })
  status: string;

  @Prop({
    type: String,
  })
  amount: string;

  @Prop({
    type: String,
  })
  currency: string;

  @Prop({
    type: String,
  })
  type: string;

  @Prop({
    type: String,
  })
  payment_method: string;

  @Prop({
    type: String,
  })
  account: string;

  @Prop({
    type: String,
  })
  bank_account: string;

  @Prop({
    type: String,
  })
  card_number: string;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  sender: ObjectId;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  receiver: ObjectId;
}

export const transactionSchema = SchemaFactory.createForClass(Transaction);
transactionSchema.plugin(paginate);
