import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class VerifyDriverDto{
    
    @ApiProperty()
    @IsNotEmpty()
    user:string;

    @ApiProperty()
    @Transform(({value})=> value === 'true' || value === true)
    @IsNotEmpty()
    @IsBoolean()
    isVerified:boolean    

}