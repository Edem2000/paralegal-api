import {IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min, MinLength} from 'class-validator';
import {RuleKind} from "domain/_processor/rules";
import {MaskingMode} from "domain/_processor/processing-config";
import {Type} from "class-transformer";

export class GetTransactionsDto {
    @Type(() => Number)
    @IsNumber()
    page: number = 1;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit: number = 20;
}
