import { Inject, Injectable } from '@nestjs/common';
import { XLSX_MIME } from 'src/domain/constants';
import {
  EXPORT_DATA_PORT,
  type ExportDataPort,
} from 'src/domain/ports/export-data.port';
import {
  EXPORT_JOB_STORE_PORT,
  type ExportJobStorePort,
} from 'src/domain/ports/export-job-store.port';
import {
  FILE_STORAGE_PORT,
  type FileStoragePort,
} from 'src/domain/ports/file-storage.port';
import {
  REPORT_GENERATOR_PORT,
  type ReportGeneratorPort,
} from 'src/domain/ports/report-generator.port';

@Injectable()
export class S3ExportUseCase {
  constructor(
    @Inject(EXPORT_DATA_PORT) private readonly data: ExportDataPort,
    @Inject(REPORT_GENERATOR_PORT)
    private readonly generator: ReportGeneratorPort,
    @Inject(FILE_STORAGE_PORT) private readonly storage: FileStoragePort,
    @Inject(EXPORT_JOB_STORE_PORT) private readonly jobs: ExportJobStorePort,
  ) {}

  start(): string {
    const job = this.jobs.create();
    void this.run(job.id);
    return job.id;
  }

  async getStatus(id: string) {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    const downloadUrl =
      job.status === 'done' && job.fileKey
        ? await this.storage.getDownloadUrl(job.fileKey, 'export-s3.xlsx', 300)
        : undefined;

    return {
      status: job.status,
      progress: job.progress,
      downloadUrl,
      error: job.error,
    };
  }

  private async run(id: string) {
    try {
      this.jobs.update(id, { status: 'processing' });
      const total = await this.data.total();
      const buffer = await this.generator.generate(
        this.data.readPages(),
        (rows) =>
          this.jobs.update(id, { progress: Math.round((rows / total) * 100) }),
      );
      const key = `exports/${id}.xlsx`;
      await this.storage.upload(key, buffer, XLSX_MIME);
      this.jobs.update(id, { status: 'done', progress: 100, fileKey: key });
    } catch (e) {
      this.jobs.update(id, {
        status: 'error',
        error: e instanceof Error ? e.message : 'Unknow error',
      });
    }
  }
}
