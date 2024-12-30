import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { STATUS } from '@/enums/status.enum';
import { PRIORITY } from '@/enums/priority.enum';

export type PaymentDocument = Payment & Document;

@Schema({
  collection: 'payments',
  timestamps: true,
})
export class Payment {
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
    type: String,
    enum: STATUS,
    default: STATUS.ACTIVE,
  })
  status: string;

  @Prop({
    type: String,
    default: PRIORITY.PRIMARY,
  })
  priority: string;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  card_number: string;
  @Prop({
    type: String,
  })
  card_exp_year: string;
  @Prop({
    type: String,
  })
  card_exp_month: string;

  @Prop({
    type: String,
  })
  card_cvc: string;

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
  payment_method: string;
}

export const paymentSchema = SchemaFactory.createForClass(Payment);
