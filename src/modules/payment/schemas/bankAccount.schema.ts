import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

export type BankAccountDocument = BankAccount & Document;

@Schema({
  collection: 'bankAccounts',
  timestamps: true,
})
export class BankAccount {
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
  })
  bankId: string;
  @Prop({
    type: String,
  })
  accountTitle: string;
  @Prop({
    type: String,
  })
  accountNum: string;
}

export const bankAccountSchema = SchemaFactory.createForClass(BankAccount);
