import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { RatingReview, ratingDocument } from './entities/rating-review.entity';
import { ObjectId } from 'mongodb';
import { BadRequestException } from '@nestjs/common';
import { CreateRatingReviewDto } from './dto/create-rating-review.dto';

export class RatingReviewRepository {
  constructor(
    @InjectModel(RatingReview.name)
    private readonly RatingReviewModel: Model<ratingDocument>,
    @InjectModel(RatingReview.name)
    private readonly RatingReviewModelPagModel: PaginateModel<ratingDocument>,
  ) {}

  async createRatingReview(ratingBody: CreateRatingReviewDto): Promise<any> {
    return await this.RatingReviewModel.create(ratingBody);
  }

  async updateRatingReview(criteria: object, data: object): Promise<any> {
    return await this.RatingReviewModel.findOneAndUpdate(criteria, data, {
      new: true,
    });
  }

  async findRatingReviewById(
    complain_id: string,
  ): Promise<RatingReview | null> {
    return await this.RatingReviewModel.findOne({
      _id: new ObjectId(complain_id),
    })
      .populate('user rider')
      .exec();
  }

  async findRatingReviews(filter: any, options: any): Promise<any | null> {
    return this.RatingReviewModelPagModel.paginate(filter, options);
  }

  async deleteRatingReview(id: string): Promise<RatingReview | null> {
    return await this.RatingReviewModel.findByIdAndDelete(new ObjectId(id));
  }

  async findRatingReviewByRiderId(rider_id: string): Promise<any | null> {
    console.log('rider id is comming : ', rider_id);

    return await this.RatingReviewModel.find({ rider: rider_id });
    // .populate('user rider')
    // .exec();
  }
}
