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

export class ProofComplaintDto {
    
      
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    proof_description:string

    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    proof_files?:Express.Multer.File[]
  
}