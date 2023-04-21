import aws from 'aws-sdk'
const AWS=aws
const s3config={
    apiVersion: "2010-12-01",
    accessKeyId:process.env.S3_ACCESSKEY,
    secretAccessKey:process.env.S3_SECRET_ACCESS_KEY,
    region:process.env.REGION
}
// AWS.config.update(s3config)
export const s3= new AWS.S3(s3config)
