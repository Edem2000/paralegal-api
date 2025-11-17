import { IsMongoId, IsString } from 'class-validator';
import { HexString } from 'domain/_core';

export class GetAuditLogDto {
  @IsString()
  @IsMongoId()
  id: HexString;
}
