import { Injectable } from '@nestjs/common';
import { ExportDataPort, ExportRow } from 'src/domain/ports/export-data.port';

@Injectable()
export class FakeDataAdapter implements ExportDataPort {
  private readonly totalRows = 50_000;
  private readonly pageSize = 5_000;

  async total(): Promise<number> {
    await Promise.resolve(1);
    return this.totalRows;
  }

  async *readPages(): AsyncGenerator<ExportRow[]> {
    for (let offset = 0; offset < this.totalRows; offset += this.pageSize) {
      await new Promise((r) => setTimeout(r, 500));
      const size = Math.min(this.pageSize, this.totalRows - offset);
      yield Array.from({ length: size }, (_, i) => {
        const id = offset + i + 1;
        return {
          id,
          name: `Usuário ${id}`,
          email: `usuario${id}@exemplo.com`,
          createdAt: new Date().toISOString(),
        };
      });
    }
  }
}
