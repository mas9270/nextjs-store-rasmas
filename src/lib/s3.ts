import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "default", // پارس‌پک region ندارد، ولی باید ست شود
  endpoint: process.env.PARSPACK_END_POINT, // مثل https://c123456.parspack.net
  forcePathStyle: true, // برای پارس‌پک الزامی است
  credentials: {
    accessKeyId: process.env.PARSPACK_ACCESSKEY as string,
    secretAccessKey: process.env.PARSPACK_SECRETKEY as string,
  },
});
