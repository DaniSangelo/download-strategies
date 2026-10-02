export type ExportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export class ExportJob {
  status: ExportStatus = 'PENDING';
  progress: number = 0;
  content?: string; // SSE
  fileKey?: string; // S3 + presigned URL

  constructor(public readonly id: string) {}
}

export type ExportEvent =
  | { type: 'progress'; progress: number }
  | { type: 'completed' }
  | { type: 'failed' };
