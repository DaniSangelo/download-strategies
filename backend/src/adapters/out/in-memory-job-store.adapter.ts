import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Observable, ReplaySubject } from 'rxjs';
import { ExportJob } from 'src/domain/export-job';
import { ExportJobStorePort } from 'src/domain/ports/export-job-store.port';

@Injectable()
export class InMemoryJobStoreAdpter implements ExportJobStorePort {
  private jobs = new Map<string, ExportJob>();
  private files = new Map<string, Buffer>();
  private streams = new Map<string, ReplaySubject<ExportJob>>();

  create(): ExportJob {
    const job: ExportJob = { id: randomUUID(), status: 'pending', progress: 0 };
    const stream = new ReplaySubject<ExportJob>(1);
    stream.next(job);
    this.jobs.set(job.id, job);
    this.streams.set(job.id, stream);
    return job;
  }

  get(id: string) {
    return this.jobs.get(id);
  }

  update(id: string, patch: Partial<ExportJob>): ExportJob {
    const current = this.jobs.get(id);
    if (!current) throw new Error(`Job ${id} not found`);
    const updated = { ...current, ...patch };
    this.jobs.set(id, updated);
    const stream = this.streams.get(id)!;
    stream.next(updated);
    if (updated.status === 'done' || updated.status === 'error') {
      stream.complete();
    }
    return updated;
  }

  watch(id: string): Observable<ExportJob> | undefined {
    return this.streams.get(id)?.asObservable();
  }

  saveFile(id: string, file: Buffer) {
    this.files.set(id, file);
  }

  getFile(id: string) {
    return this.files.get(id);
  }
}
