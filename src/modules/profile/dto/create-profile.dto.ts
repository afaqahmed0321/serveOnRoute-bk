import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsDefined, IsOptional, IsObject, IsNotEmpty,
} from 'class-validator';
import {ProfileDto} from "@/modules/profile/dto/profile.dto";

export class CreateProfileDto {
  @ApiProperty({ type: ProfileDto })
  @ValidateNested({
    each: true,
  })
  @IsDefined()
  @IsObject()
  @IsNotEmpty()
  @Type(() => ProfileDto)
  profile?: ProfileDto

 
}
