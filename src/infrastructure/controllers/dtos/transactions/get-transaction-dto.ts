import {IsMongoId, IsString} from "class-validator";
import {HexString} from "domain/_core";

export class GetTransactionDto {
    @IsString()
    @IsMongoId()
    id: HexString;
}