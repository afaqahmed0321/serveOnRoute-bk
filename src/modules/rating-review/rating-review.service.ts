import { Injectable } from '@nestjs/common';
import { CreateRatingReviewDto } from './dto/create-rating-review.dto';
import { UpdateRatingReviewDto } from './dto/update-rating-review.dto';
import { RatingReviewRepository } from './rating-review.repository';
import { QueryRatingDto } from './dto/query-rating.dto';
import * as _  from 'lodash';

@Injectable()
export class RatingReviewService {
  constructor(private readonly ratingRepository: RatingReviewRepository) {}

  async create(createRatingReviewDto: CreateRatingReviewDto) {
    console.log('Create ratings: ', createRatingReviewDto);
    return await this.ratingRepository.createRatingReview(
      createRatingReviewDto,
    );
  }

  async findAll(queryBidDto: QueryRatingDto) {
    const filter = _.pick(queryBidDto, ['parcel', 'rider', 'amount']);
    const options = _.pick(queryBidDto, ['page', 'limit', 'populate', 'sort']);
    return await this.ratingRepository.findRatingReviews(filter, options);
  }

  async findOne(id: string) {
    return await this.ratingRepository.findRatingReviewById(id);
  }

  async update(id: string, updateRatingReviewDto: UpdateRatingReviewDto) {
    return await this.ratingRepository.updateRatingReview(
      { _id: id },
      updateRatingReviewDto,
    );
  }

  async remove(id: string) {
    return await this.ratingRepository.deleteRatingReview(id);
  }

}
