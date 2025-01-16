/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class SendOtpDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number:string
}