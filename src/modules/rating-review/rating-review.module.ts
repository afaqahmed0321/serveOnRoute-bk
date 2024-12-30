import { Module } from '@nestjs/common';
import { RatingReviewService } from './rating-review.service';
import { RatingReviewController } from './rating-review.controller';
import { RatingReviewRepository } from './rating-review.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingReview, ratingSchema } from './entities/rating-review.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RatingReview.name, schema: ratingSchema },
    ]),
  ],
  exports: [RatingReviewRepository],
  controllers: [RatingReviewController],
  providers: [RatingReviewService, RatingReviewRepository],
})
export class RatingReviewModule {}
