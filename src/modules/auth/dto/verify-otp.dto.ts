import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class verifyOtpDto{
    @ApiProperty()
    @IsString()
    readonly phone_number:string
    
    @ApiProperty()
    @IsString()
    readonly OTP:string
}