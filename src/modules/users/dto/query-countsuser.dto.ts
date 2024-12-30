import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class QueryUserCountsDto{
    @ApiProperty({
        example:'user | rider'
    })
    @IsNotEmpty()
    role:string
}