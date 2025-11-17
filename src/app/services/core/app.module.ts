import { Module } from '@nestjs/common';
import { MainController } from 'infrastructure/controllers/controller';
import { AuditLogUsecasesModule } from 'di/common/modules/domain/usecases/audit-logs-usecases-module';

@Module({
  imports: [
    AuditLogUsecasesModule,
  ],
  providers: [],
  controllers: [
    MainController,
  ],
})
export class AppModule {}
