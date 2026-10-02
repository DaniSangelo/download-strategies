import { Module } from '@nestjs/common';
import { S3_CLIENT, s3ClientProvider } from '.';

@Module({
  providers: [s3ClientProvider],
  exports: [S3_CLIENT],
})
export class S3Module {}
