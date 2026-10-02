import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';

export const S3_CLIENT = 'S3_CLIENT';
export const s3ClientProvider: Provider = {
  provide: S3_CLIENT,
  useFactory: () =>
    new S3Client({
      region: process.env.AWS_REGION!,
      endpoint: process.env.AWS_ENDPOINT!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY!,
        secretAccessKey: process.env.AWS_ACCESSKEY_SECRET!,
      },
    }),
};
