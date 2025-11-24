import {IsNumber, Max, Min} from 'class-validator';
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
