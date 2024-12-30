import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class QueryLoggedInDto{
    @ApiPropertyOptional()
    @IsOptional()
    phone:string

    @ApiPropertyOptional()
    @IsOptional()
    email:string
    
    @ApiPropertyOptional()
    @IsOptional()
    userId:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isLoggedIn:boolean


}