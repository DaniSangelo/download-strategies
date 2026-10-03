export interface ExportRow {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface ExportDataPort {
  total(): Promise<number>;
  readPages(): AsyncGenerator<ExportRow[]>;
}

export const EXPORT_DATA_PORT = Symbol('EXPORT_DATA_PORT');
