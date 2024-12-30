import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { UsersService } from '../users/users.service';
import { ComplaintsRepository } from './complaints.repository';
import { Complaint, ComplaintSchema } from './schemas/complaint.schema';
import { MongooseModule } from '@nestjs/mongoose';
import UsersModule from '../users/users.module';
import { UploadsModule } from '../uploads/uploads.module';
import { UploadsService } from '../uploads/uploads.service';
import { StripeService } from '@/helpers/stripe.hepler';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Complaint.name, schema: ComplaintSchema }]),
    UsersModule,
    UploadsModule
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService,UsersService,ComplaintsRepository,UploadsService,StripeService],
  exports:[ ComplaintsRepository ]
})
export class ComplaintsModule {}
