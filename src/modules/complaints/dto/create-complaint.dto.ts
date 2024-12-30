import { ROLE } from '@/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateComplaintDto {  

  _id: string;

  complainant: string;

  @ApiProperty()
  @IsString()
  complain_against: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  parcel:string

  
  @ApiPropertyOptional({
    type:String
  })
  @IsString()
  description:string

  @ApiPropertyOptional({
    type:'array',
    items:{
      type:'string',
      format:'binary'
    }
  })
  files:Array<Express.Multer.File>

}
