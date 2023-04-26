// import { S3init } from "../Config/s3.config.js"

export const s3FileUpload=async({bucketname,key,body,contentType})=>{
    return await S3init.putObject({
        Bucket:bucketname,
        Key:key,
        Body:body,
        ContentType:contentType
    })
}
export const s3deleteFile=async({bucketname,key})=>{
    return await S3init.deleteObject({
        Bucket:bucketname,
        Key:key
    })
}