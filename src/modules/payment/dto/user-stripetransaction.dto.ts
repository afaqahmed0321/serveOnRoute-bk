import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UserStripeTransaction{
    
    @ApiPropertyOptional()
    @IsOptional()
    user:string

    @ApiPropertyOptional()
    @IsOptional()
    customer:string
}