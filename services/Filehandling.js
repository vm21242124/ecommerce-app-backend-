// import { s3 } from "../Config/s3.config.js"

// export const s3FileUpload=async({bucketname,key,body,contentType})=>{
//     return await s3.upload({
//         Bucket:bucketname,
//         Key:key,
//         Body:body,
//         ContentType:contentType
//     }).promise()
// }
// export const s3deleteFile=async({bucketname,key})=>{
//     return await s3.deleteObject({
//         Bucket:bucketname,
//         Key:key
//     }).promise()
// }