import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './schemas/profile.schema';
import { ProfileRepository } from './profile.repository';
import { UsersService } from '../users/users.service';
import {SUCCESSFULLY_SAVED} from "@/constants/constants";
import {UploadsService} from '@/modules/uploads/uploads.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userService: UsersService,
    private readonly uploadsService:UploadsService
  ) {}



  async create(profile: CreateProfileDto): Promise<Profile> {
    return this.profileRepository.createProfile(profile); 
  }

  async findUserByUserId(userEmail: string, userType : string): Promise<object | null> {
    const user = await this.userService.findUserByEmail(userEmail);
    const userId: any = user?._id;
      let filter ;

    if (userType && userType === 'user') {
         filter = {
            user_id: userId,
            type:  userType
        }
    } else {
        filter = {
            user_id: userId,
            type:  {$ne : 'user'}
        }
    }
    return await this.profileRepository.findProfileByUserId(filter);
  }

  async findProfilePublicViewByUserId(userId: string): Promise<object | null> {
      const data = {
          user_id: userId,
          type:  {$ne : 'user'}
      }
      return await this.profileRepository.findProfileByUserId(data);
  }


  async updateProfile(userId: string, req: any, userType: string): Promise<object> {
      let filter ;
      let images = []

      if (userType && userType === 'user') {
          filter = {
              user_id: userId,
              type:  userType
          }
      } else {
          filter = {
              user_id: userId,
              type:  {$ne : 'user'}
          }
      }

      for (let i = 0; i < req.certificates.length; i++) {
          const extension = req.certificates[i].split(';')[0].split('/')[1]
          // to declare some path to store your converted image
          const fileName = Date.now()+'.'+extension
          const image = req.certificates[i];
          const uploadedImageResponse = await this.uploadsService.uploadFileBase64(image, fileName)
          images.push(uploadedImageResponse.Location)
      }

    return this.profileRepository.updateProfile(filter, {certificates: images});
  }

}
