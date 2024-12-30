import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RouteWaypointDto{
    @ApiProperty()
    @IsNotEmpty()
    from_cord:string   

    @ApiProperty()
    @IsNotEmpty()
    to_cord:string   
}