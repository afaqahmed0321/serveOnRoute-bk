import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsOptional } from "class-validator";

export class listTransactionDto{
    @ApiPropertyOptional()
    @IsDefined()
    limit:string
    
    @ApiPropertyOptional()
    @IsOptional()
    user:string

    // @ApiPropertyOptional()
    // @IsDefined()
    // type:string


}