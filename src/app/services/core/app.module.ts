import { Module } from '@nestjs/common';
import { MainController } from 'infrastructure/controllers/controller';
import { UsecasesModule } from 'di/common/modules/domain/usecases/usecases-module';

@Module({
  imports: [
    UsecasesModule,
  ],
  providers: [],
  controllers: [
    MainController,
  ],
})
export class AppModule {}
