import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { FileStoragePort } from 'src/domain/ports/file-storage.port';
import { S3_CLIENT } from 'src/infra/aws/s3';

@Injectable()
export class S3FileStorageAdapter implements FileStoragePort, OnModuleInit {
  private readonly bucket = process.env.S3_BUCKET!;

  constructor(
    @Inject(S3_CLIENT)
    private readonly s3: S3Client,
  ) {}

  // ensure bucket exists on application bootstrap
  async onModuleInit() {
    const cmdInput = { Bucket: this.bucket };
    try {
      await this.s3.send(new HeadBucketCommand(cmdInput));
    } catch {
      await this.s3.send(new CreateBucketCommand(cmdInput));
    }
  }

  async upload(key: string, body: string, contentType: string): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  getDownloadUrl(
    key: string,
    fileName: string,
    expiresInSeconds: number,
  ): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        //forces browser download the file instead of to open the file into the browser
        ResponseContentDisposition: `attachment; filename=${fileName}`,
      }),
      { expiresIn: expiresInSeconds },
    );
  }
}
