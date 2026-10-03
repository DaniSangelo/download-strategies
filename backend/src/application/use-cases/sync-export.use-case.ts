import { Inject, Injectable } from '@nestjs/common';
import {
  EXPORT_DATA_PORT,
  type ExportDataPort,
} from 'src/domain/ports/export-data.port';
import {
  REPORT_GENERATOR_PORT,
  type ReportGeneratorPort,
} from 'src/domain/ports/report-generator.port';

@Injectable()
export class SyncExportUseCase {
  constructor(
    @Inject(EXPORT_DATA_PORT)
    private readonly data: ExportDataPort,
    @Inject(REPORT_GENERATOR_PORT)
    private readonly generator: ReportGeneratorPort,
  ) {}

  execute(): Promise<Buffer> {
    return this.generator.generate(this.data.readPages());
  }
}
