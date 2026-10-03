import { Module } from '@nestjs/common';
import { ExportModule } from './export.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ExportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
