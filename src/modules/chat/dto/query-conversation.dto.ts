import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import {ObjectId as mongoObj} from 'mongodb'
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class QueryConversationDto{
    members: [ObjectId | mongoObj| undefined, ObjectId | mongoObj | undefined]

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    member:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    parcel?:string
}