import { Test, TestingModule } from '@nestjs/testing';
import { RatingReviewService } from './rating-review.service';

describe('RatingReviewService', () => {
  let service: RatingReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingReviewService],
    }).compile();

    service = module.get<RatingReviewService>(RatingReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
