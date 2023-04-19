export const config={
    port:process.env.PORT,
    dburl:process.env.DBURL,
    jwt_secret_key:process.env.JWT_SECRET,
    jwt_expiry:process.env.JWT_EXPIRY,
    S3_access_key:process.env.S2_ACCESSKEY,
    s3_secret_key:process.env.S3_SECRET_ACCESS_KEY,
    s3_region:process.env.S3_REGION,
    s3_bucketname:process.env.S2_BUCKET_NAME
}