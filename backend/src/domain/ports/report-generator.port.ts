import { ExportRow } from './export-data.port';

export interface ReportGeneratorPort {
  generate(
    pages: AsyncIterable<ExportRow[]>,
    onProgress?: (processedRows: number) => void,
  ): Promise<Buffer>;
}

export const REPORT_GENERATOR_PORT = Symbol('REPORT_GENERATOR_PORT');
