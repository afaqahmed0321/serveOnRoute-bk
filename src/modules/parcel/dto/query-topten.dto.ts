import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class QueryTopTenDto{
    @ApiPropertyOptional({
        example:'customer || rider'
    })
    @IsOptional()
    queryFor:string
}