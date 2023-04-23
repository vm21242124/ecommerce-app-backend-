import aws from "aws-sdk";
let s3 = new aws.S3({
  region: "Asia Pacific (Mumbai) ap-south-1",
  accessKeyId: "AKIAVVTUYTF2HAPFDL52",
  secretAccessKey: "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",
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
