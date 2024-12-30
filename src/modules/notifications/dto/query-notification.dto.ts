import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDefined, IsString, IsBoolean, IsOptional } from "class-validator";

export class QueryNotificationDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    type:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    user:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    page:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    limit:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    populate:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sort:string

    // @Transform((value:any)=> value === true)
    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsBoolean()
    // is_read:boolean
}