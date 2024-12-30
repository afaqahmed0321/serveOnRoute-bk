import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CompleteParcelDto{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    otp:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status:string

}