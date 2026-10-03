import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MessageEvent,
  NotFoundException,
  Param,
  Post,
  Res,
  Sse,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import { S3ExportUseCase } from 'src/application/use-cases/s3-export.use-case';
import { SseExportUseCase } from 'src/application/use-cases/sse-export.use-case';
import { SyncExportUseCase } from 'src/application/use-cases/sync-export.use-case';
import { XLSX_MIME } from 'src/domain/constants';

@Controller('exports')
export class ExportController {
  constructor(
    private readonly syncExport: SyncExportUseCase,
    private readonly s3Export: S3ExportUseCase,
    private readonly sseExport: SseExportUseCase,
  ) {}

  @Get('sync')
  async sync(@Res({ passthrough: true }) res: Response) {
    const buffer = await this.syncExport.execute();
    res.set({
      'Content-Type': XLSX_MIME,
      'Content-Disposition': 'attachment: filename="export-sync.xlsx"',
    });
    return new StreamableFile(buffer);
  }

  @Post('s3')
  @HttpCode(HttpStatus.ACCEPTED)
  startS3() {
    return { jobId: this.s3Export.start() };
  }

  @Get('s3/:id')
  async s3Status(@Param('id') id: string) {
    const status = await this.s3Export.getStatus(id);
    if (!status) throw new NotFoundException('Job not found');
    return status;
  }

  @Post('sse')
  @HttpCode(HttpStatus.ACCEPTED)
  startSse() {
    return { jobId: this.sseExport.start() };
  }

  @Sse('sse/:id/events')
  events(@Param('id') id: string): Observable<MessageEvent> {
    const stream$ = this.sseExport.watch(id);
    if (!stream$) throw new NotFoundException('Job não encontrado');
    return stream$.pipe(
      map((job) => ({
        data: {
          status: job.status,
          progress: job.progress,
          error: job.error,
        },
      })),
    );
  }

  @Get('sse/:id/download')
  download(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const file = this.sseExport.getFile(id);
    if (!file) throw new NotFoundException('File not found');
    res.set({
      'Content-Type': XLSX_MIME,
      'Content-Disposition': 'attachment: filename="export-sse.xlsx"',
    });
    return new StreamableFile(file);
  }
}
