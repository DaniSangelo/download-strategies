import { Module } from '@nestjs/common';
import { s3ClientProvider } from './infra/aws/s3';
import { EXPORT_DATA_PORT } from './domain/ports/export-data.port';
import { REPORT_GENERATOR_PORT } from './domain/ports/report-generator.port';
import { FILE_STORAGE_PORT } from './domain/ports/file-storage.port';
import { EXPORT_JOB_STORE_PORT } from './domain/ports/export-job-store.port';
import { SyncExportUseCase } from './application/use-cases/sync-export.use-case';
import { S3ExportUseCase } from './application/use-cases/s3-export.use-case';
import { SseExportUseCase } from './application/use-cases/sse-export.use-case';
import { S3FileStorageAdapter } from './adapters/out/s3-file-storage.adapter';
import { ExcelJsReportGeneratorAdapter } from './adapters/out/exceljs-report-generator.adapter';
import { FakeDataAdapter } from './adapters/out/fake-data.adapter';
import { InMemoryJobStoreAdapter } from './adapters/out/in-memory-job-store.adapter';
import { ExportController } from './infra/http/export.controller';

@Module({
  imports: [],
  controllers: [ExportController],
  providers: [
    s3ClientProvider,
    { provide: EXPORT_DATA_PORT, useClass: FakeDataAdapter },
    { provide: REPORT_GENERATOR_PORT, useClass: ExcelJsReportGeneratorAdapter },
    { provide: FILE_STORAGE_PORT, useClass: S3FileStorageAdapter },
    { provide: EXPORT_JOB_STORE_PORT, useClass: InMemoryJobStoreAdapter },
    SyncExportUseCase,
    S3ExportUseCase,
    SseExportUseCase,
  ],
})
export class ExportModule {}
