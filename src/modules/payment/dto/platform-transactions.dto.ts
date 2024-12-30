import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import {RequireBothIfOneHasValue} from '@decorators/both-value.decorator.dto'

export class PlatformTransactionDto{
    @ApiPropertyOptional({
        example:'2023-01-01'
    })
    @IsOptional()
    @RequireBothIfOneHasValue()
    startDate:Date

    @ApiPropertyOptional({
        example:'2023-01-01'
    })
    @IsOptional()
    @RequireBothIfOneHasValue()
    endDate:Date
}