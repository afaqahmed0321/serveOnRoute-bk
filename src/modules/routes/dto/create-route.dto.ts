import { ToBoolean } from "@/helpers/general.helper";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty,IsOptional,IsString } from "class-validator";
import { ObjectId } from "mongoose";
import { Transform } from "class-transformer";
import { DAYS } from "@/enums/days.enum";

export class CreateRouteDto {

    @ApiProperty({type:String})
    @IsNotEmpty()
    @IsString()
    from: string;

    @ApiProperty({type:String})
    @IsNotEmpty()
    @IsString()
    to: string

    @ApiProperty({type:String})
    @IsNotEmpty()
    @IsString()
    from_cord: string

    @ApiProperty({type:String})
    @IsNotEmpty()
    @IsString()
    to_cord:string

    @ApiPropertyOptional({type: Array,example:Object.values(DAYS)})
    @IsOptional()
    schedule:DAYS[]

    @ApiProperty({type:Date})
    @IsString()
    start_time:string

    @ApiProperty({type:Date})
    @IsString()
    end_time:string

    @ApiPropertyOptional({type:Boolean})
    @IsOptional()
    status:string

    // @ApiProperty({type:String})
    // @IsString()
    // distance:string

    @ApiProperty({type:Boolean})
    @Transform(({value})=> (value === 'true'||'1') ? true : false)
    @IsBoolean()
    has_diversion:boolean
    
    rider?:ObjectId
}
