import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import UsersModule from '../users/users.module';
import {UploadsModule} from '@/modules/uploads/uploads.module';

@Module({
  imports: [
    UsersModule,
    UploadsModule,
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, ProfileRepository],
})
export default class ProfileModule {}
