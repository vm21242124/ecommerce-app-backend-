import { S3 } from "@aws-sdk/client-s3";
export const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});


