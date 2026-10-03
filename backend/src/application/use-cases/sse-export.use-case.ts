import { Inject, Injectable } from '@nestjs/common';
import {
  EXPORT_DATA_PORT,
  type ExportDataPort,
} from 'src/domain/ports/export-data.port';
import {
  EXPORT_JOB_STORE_PORT,
  type ExportJobStorePort,
} from 'src/domain/ports/export-job-store.port';
import {
  REPORT_GENERATOR_PORT,
  type ReportGeneratorPort,
} from 'src/domain/ports/report-generator.port';

@Injectable()
export class SseExportUseCase {
  constructor(
    @Inject(EXPORT_DATA_PORT) private readonly data: ExportDataPort,
    @Inject(REPORT_GENERATOR_PORT)
    private readonly generator: ReportGeneratorPort,
    @Inject(EXPORT_JOB_STORE_PORT) private readonly jobs: ExportJobStorePort,
  ) {}

  start(): string {
    const job = this.jobs.create();
    void this.run(job.id);
    return job.id;
  }

  watch(id: string) {
    return this.jobs.watch(id);
  }

  getFile(id: string) {
    return this.jobs.getFile(id);
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
      this.jobs.saveFile(id, buffer);
      this.jobs.update(id, { status: 'done', progress: 100 });
    } catch (error) {
      this.jobs.update(id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unkwnow error',
      });
    }
  }
}
