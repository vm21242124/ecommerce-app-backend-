import aws from "aws-sdk";
let s3 = new aws.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

export const uploadImg = async ({ bucket, key, body, contentType }) => {
  return await s3
    .putObject(
      {
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      (err, sucess) => {
        if (err) {
          console.log(err);
        }
        console.log(sucess);
      }
    )
    .promise();
};
export const deleteImg = async ({ bucket, key }) => {
  return await s3.deleteObject(
    {
      Bucket: bucket,
      Key: key,
    },
    (err, sucess) => {
      if (err) {
        console.log(err);
      }
      console.log(sucess);
    }
  ).promise();
};
