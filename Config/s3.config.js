import aws from 'aws-sdk'
export const s3=new aws.S3({
    accessKeyId:process.env.S3_ACCESSKEY,
    secretAccessKey:S3_SECRET_ACCESS_KEY,
    region:process.env.REGION
})