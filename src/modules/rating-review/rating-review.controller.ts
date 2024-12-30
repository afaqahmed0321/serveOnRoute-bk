import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RatingReviewService } from './rating-review.service';
import { CreateRatingReviewDto } from './dto/create-rating-review.dto';
import { UpdateRatingReviewDto } from './dto/update-rating-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@/decorators/role.decorator';
import { ROLE } from '@/enums/role.enum';
import { QueryRatingDto } from './dto/query-rating.dto';

@ApiTags('rating')
@Controller('rating-review')
export class RatingReviewController {
  constructor(private readonly ratingReviewService: RatingReviewService) {}

  // @UseGuards(JwtAuthGuard)
  // @Auth(
  //   Role.ADMIN,
  //   Role.SUPER_ADMIN,
  //   Role.NORMAL_USER,
  //   Role.ADMIN,
  //   Role.MANAGER,
  // )
  @Post()
  create(@Body() createRatingReviewDto: CreateRatingReviewDto) {
    return this.ratingReviewService.create(createRatingReviewDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Auth(
  //   Role.ADMIN,
  //   Role.SUPER_ADMIN,
  //   Role.NORMAL_USER,
  //   Role.ADMIN,
  //   Role.MANAGER,
  // )
  @Get()
  findAll(@Query() query: QueryRatingDto) {
    return this.ratingReviewService.findAll(query);
  }

  // @UseGuards(JwtAuthGuard)
  // @Auth(
  //   Role.ADMIN,
  //   Role.SUPER_ADMIN,
  //   Role.NORMAL_USER,
  //   Role.ADMIN,
  //   Role.MANAGER,
  // )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingReviewService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Auth(
  //   Role.ADMIN,
  //   Role.SUPER_ADMIN,
  //   Role.NORMAL_USER,
  //   Role.ADMIN,
  //   Role.MANAGER,
  // )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRatingReviewDto: UpdateRatingReviewDto,
  ) {
    return this.ratingReviewService.update(id, updateRatingReviewDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Auth(
  //   Role.ADMIN,
  //   Role.SUPER_ADMIN,
  //   Role.NORMAL_USER,
  //   Role.ADMIN,
  //   Role.MANAGER,
  // )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingReviewService.remove(id);
  }
}
