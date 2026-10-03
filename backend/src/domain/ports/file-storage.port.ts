export interface FileStoragePort {
  upload(key: string, body: Buffer, contentType: string): Promise<void>;
  getDownloadUrl(
    key: string,
    fileName: string,
    expiresInSeconds: number,
  ): Promise<string>;
}

export const FILE_STORAGE_PORT = Symbol('FILE_STORAGE_PORT');
