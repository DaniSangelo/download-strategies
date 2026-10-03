import { Observable } from 'rxjs';
import { ExportJob } from '../export-job';

export interface ExportJobStorePort {
  create(): ExportJob;
  get(id: string): ExportJob | undefined;
  update(id: string, patch: Partial<ExportJob>): ExportJob;
  watch(id: string): Observable<ExportJob> | undefined;
  saveFile(id: string, file: Buffer): void;
  getFile(id: string): Buffer | undefined;
}

export const EXPORT_JOB_STORE_PORT = Symbol('EXPORT_JOB_STORE_PORT');
