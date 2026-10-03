import { Injectable } from '@nestjs/common';
import { ExportRow } from 'src/domain/ports/export-data.port';
import { ReportGeneratorPort } from 'src/domain/ports/report-generator.port';
import ExcelJs from 'exceljs';

@Injectable()
export class ExcelJsReportGeneratorAdapter implements ReportGeneratorPort {
  async generate(
    pages: AsyncIterable<ExportRow[]>,
    onProgress?: (processedRows: number) => void,
  ): Promise<Buffer> {
    // for large size files it more appropriate use stream by using WorkbookWriter
    const workbook = new ExcelJs.Workbook();
    const sheet = workbook.addWorksheet('Export');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'NOme', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Criado em', key: 'createdAt', width: 28 },
    ];

    let processed = 0;
    for await (const page of pages) {
      sheet.addRows(page);
      processed += page.length;
      onProgress?.(processed);
    }

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }
}
