import { Observable } from 'rxjs';
import { ExportEvent } from '../export-job';

export abstract class ExportEventsPort {
  abstract publish(jobId: string, event: ExportEvent): void;
  abstract subscribe(jobId: string): Observable<ExportEvent>;
}
