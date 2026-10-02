import { Injectable } from '@nestjs/common';
import { ExportJob } from 'src/domain/export-job';
import { ExportJobRepositoryPort } from 'src/domain/ports/export-job-repository.port';

@Injectable()
export class InMemoryExportJobRepository implements ExportJobRepositoryPort {
  private readonly jobs = new Map<string, ExportJob>();

  async save(job: ExportJob): Promise<void> {
    await Promise.resolve();
    this.jobs.set(job.id, job);
  }

  async findById(id: string): Promise<ExportJob | null> {
    await Promise.resolve();
    return this.jobs.get(id) ?? null;
  }
}
