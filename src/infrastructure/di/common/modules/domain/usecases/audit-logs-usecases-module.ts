import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { AuditLogModule } from 'di/common/modules/domain/entities/audit-log-module';

@Module({
  imports: [
    AuditLogModule,
  ],
  providers: [

  ],
  exports: [Symbols.usecases.auditLogs.get, Symbols.usecases.auditLogs.getOne, ],
})

export class AuditLogUsecasesModule {}