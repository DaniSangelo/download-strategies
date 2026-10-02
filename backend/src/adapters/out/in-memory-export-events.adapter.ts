import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { ExportEvent } from '../../domain/export-job';
import { ExportEventsPort } from '../../domain/ports/export-events.port';

@Injectable()
export class InMemoryExportEventsAdapter implements ExportEventsPort {
  private readonly subjects = new Map<string, ReplaySubject<ExportEvent>>();

  // ReplaySubject(1): quem conectar no SSE depois do job já ter começado
  // (ou até terminado) recebe imediatamente o último evento.
  /*
    Anyone else who connects to the SSE after the job has already started
    (or even finished) will immediately receive the previous event.
  */
  private getSubject(jobId: string) {
    let subject = this.subjects.get(jobId);
    if (!subject) {
      subject = new ReplaySubject<ExportEvent>(1);
      this.subjects.set(jobId, subject);
    }
    return subject;
  }

  publish(jobId: string, event: ExportEvent) {
    const subject = this.getSubject(jobId);
    subject.next(event);
    if (event.type !== 'progress') subject.complete(); // finishes the stream
  }

  subscribe(jobId: string): Observable<ExportEvent> {
    return this.getSubject(jobId).asObservable();
  }
}
