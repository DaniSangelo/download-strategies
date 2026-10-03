import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT } from 'src/infra/aws/s3';
import { FileStoragePort } from 'src/domain/ports/file-storage.port';

@Injectable()
export class S3FileStorageAdapter implements FileStoragePort {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    config: ConfigService,
  ) {
    this.bucket = config.getOrThrow<string>('S3_BUCKET');
  }

  async upload(key: string, body: Buffer, contentType: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async getDownloadUrl(
    key: string,
    fileName: string,
    expiresInSeconds: number,
  ) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      // download instead open file in the browser
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });
    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }
}
