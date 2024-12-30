import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CancelParcelDto{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    parcel:string


}