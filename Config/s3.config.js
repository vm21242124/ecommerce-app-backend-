import aws from 'aws-sdk'
import { config } from './config.js'
export const s3=new aws.S3({
    accessKeyId:config.S3_access_key,
    secretAccessKey:config.s3_secret_key,
    region:config.s3_region
})