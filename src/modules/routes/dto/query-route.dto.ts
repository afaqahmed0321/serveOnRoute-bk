import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QueryRouteDto{

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    from:string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    to:string

    // @ApiPropertyOptional()
    // @IsString()
    // @IsOptional()
    // @IsNotEmpty()
    // start_time:string

    // @ApiPropertyOptional()
    // @IsString()
    // @IsOptional()
    // @IsNotEmpty()
    // end_time:string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    rider:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    page:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    limit:string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    sort:string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    populate:string
}