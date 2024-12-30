import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { StripeService } from '@/helpers/stripe.hepler';
import { UsersController } from '@users/users.controller';
import { UploadsModule } from '@/modules/uploads/uploads.module';
import { RatingReviewModule } from './../rating-review/rating-review.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UploadsModule,
    RatingReviewModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository,StripeService],
  exports: [UsersService, UsersRepository],
})
export default class UsersModule {}
