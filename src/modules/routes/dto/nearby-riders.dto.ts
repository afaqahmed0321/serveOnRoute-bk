import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NearByWaypoints{
    @ApiProperty()
    @IsNotEmpty()
    location:string

    @ApiProperty()
    @IsNotEmpty()
    maxDistance:string
}