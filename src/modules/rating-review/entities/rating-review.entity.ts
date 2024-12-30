import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

export type ratingDocument = RatingReview & Document;

@Schema({
  collection: 'Rating',
  timestamps: true,
})
export class RatingReview {
  @Prop({
    type: ObjectId,
    default: () => new ObjectId(),
  })
  _id: ObjectId;

  @Prop({
    type: Number,
  })
  rating: number;

  @Prop({
    type: String,
  })
  review: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  rider: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: ObjectId;
}

export const ratingSchema = SchemaFactory.createForClass(RatingReview);
ratingSchema.plugin(paginate);
