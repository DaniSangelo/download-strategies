export type ExportJobStatus = 'pending' | 'processing' | 'done' | 'error';

export interface ExportJob {
  id: string;
  status: ExportJobStatus;
  progress: number; // 0-100
  fileKey?: string; // S3
  error?: string;
}
