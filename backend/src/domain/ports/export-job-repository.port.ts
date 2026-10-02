import { ExportJob } from '../export-job';

export abstract class ExportJobRepositoryPort {
  abstract save(job: ExportJob): Promise<void>;
  abstract findById(id: string): Promise<ExportJob | null>;
}
