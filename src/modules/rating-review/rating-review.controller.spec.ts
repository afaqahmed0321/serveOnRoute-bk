import { Test, TestingModule } from '@nestjs/testing';
import { RatingReviewController } from './rating-review.controller';
import { RatingReviewService } from './rating-review.service';

describe('RatingReviewController', () => {
  let controller: RatingReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingReviewController],
      providers: [RatingReviewService],
    }).compile();

    controller = module.get<RatingReviewController>(RatingReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
