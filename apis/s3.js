import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const uploadBase64ToS3 = async (base64, callback) => {
  const cloudfrontURL = process.env.CLOUDFRONTURL;

  // Configure AWS with your access and secret key.
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } =
    process.env;

  // Create an s3 instance
  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = new Buffer.from(
    base64.replace(/^data:.+;base64,/, ""),
    "base64"
  );

  // Getting the file extension
  const extension = base64.split(";")[0].split("/")[1].replace("+xml", "");

  // Getting the content type
  const ContentType = base64.split(";")[0].split(":")[1];

  // Generate the file name
  const fileName = `${crypto.randomBytes(20).toString("hex")}.${extension}`;

  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileName, // type is not required
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType,
  });

  try {
    const response = await s3.send(params);

    const filepath = `${cloudfrontURL}/${fileName}`;
    callback(null, filepath, extension, response);
  } catch (err) {
    callback(err);
  }
};
