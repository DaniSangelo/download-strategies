export abstract class FileStoragePort {
  abstract upload(
    key: string,
    body: string,
    contentType: string,
  ): Promise<void>;

  abstract getDownloadUrl(
    key: string,
    fileName: string,
    expiresInSeconds: number,
  ): Promise<string>;
}
