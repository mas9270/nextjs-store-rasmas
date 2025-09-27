// src/lib/parspack.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * آپلود فایل‌ها به پارس‌پک S3
 * @param files آرایه File یا Base64 string
 * @returns آرایه URL فایل‌های آپلود شده
 */
export async function uploadFilesToParspack(
  files: File[] | string[]
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files.slice(0, 10)) {
    let tempFilePath: string | null = null;

    try {
      let filePathInBucket: string;
      let stream: fs.ReadStream;

      if (typeof file === "string") {
        // Base64: ذخیره موقت روی سرور
        const matches = file.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error("Base64 نامعتبر");
        const mime = matches[1];
        const base64Data = matches[2];
        const ext = mime.split("/")[1] || "png";

        const tempName = `product_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.${ext}`;
        tempFilePath = path.join(os.tmpdir(), tempName);
        fs.writeFileSync(tempFilePath, Buffer.from(base64Data, "base64"));

        stream = fs.createReadStream(tempFilePath);
        filePathInBucket = `products/${tempName}`;
      } else {
        // File واقعی
        const ext = file.name.split(".").pop() || "png";
        const tempName = `product_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.${ext}`;
        tempFilePath = path.join(os.tmpdir(), tempName);

        // ذخیره موقت فایل روی سرور
        const arrayBuffer = await file.arrayBuffer();
        fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

        stream = fs.createReadStream(tempFilePath);
        filePathInBucket = `products/${tempName}`;
      }

      // آپلود به پارس‌پک
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.PARSPACK_BUCKET,
          Key: filePathInBucket,
          Body: stream,
          // ACL: "private",
        })
      );

      urls.push(`${process.env.PARSPACK_END_POINT}/${filePathInBucket}`);
    } catch (err: any) {
      console.error("خطا در آپلود فایل:", err);
      throw new Error(`آپلود فایل با خطا مواجه شد: ${err.message}`);
    } finally {
      // حذف فایل موقت
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  return urls;
}
