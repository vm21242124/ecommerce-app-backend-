import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAVVTUYTF2KTTK4NUE",
    secretAccessKey: "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",
  },
});

export const uploadImg = async ({ bucketname, key, body, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: bucketname,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  const res = await s3client.send(command);
  const command1 = new GetObjectCommand({
    Bucket: bucketname,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3client, command1);
  return {
    signedUrl,
    res
  }
};
export const getUrlObject = async ({ bucketname, key }) => {
  const command = new GetObjectCommand({
    Bucket: bucketname,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3client, command, {
    expiresIn: 3600,
  });
  console.log(signedUrl);
  return signedUrl;
};
export const deleteImg = async ({ bucketname, key }) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketname,
    Key: key,
  });
  const res = await s3client.send(command);
  return res;
};
