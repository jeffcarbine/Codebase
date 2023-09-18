/**
 * UPLOAD IMAGES TO S3
 * https://devcenter.heroku.com/articles/s3-upload-node
 * 
 * 
  [
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD",
            "POST",
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
  ]

  change "AllowedOrigins" to the site's domains once in production
 */

// import AWS from "aws-sdk";
// import bluebird from "bluebird";
// AWS.config.setPromisesDependency(bluebird);
// const S3BUCKET = process.env.S3BUCKET,
//   bucket = new AWS.S3({ params: { Bucket: S3BUCKET } });

// export const uploadBase64ToS3 = (url, userId, keyModifier, callback) => {
//   const base64Data = new Buffer.from(
//     url.replace(/^data:image\/\w+;base64,/, ""),
//     "base64"
//   );

//   // Getting the file type, ie: jpeg, png or gif
//   const type = url.split(";")[0].split("/")[1];

//   var data = {
//     Key: `${userId.toString()}.${keyModifier}`,
//     Body: base64Data,
//     ACL: "public-read",
//     ContentEncoding: "base64",
//     ContentType: `image/${type}`,
//   };

//   bucket.upload(data, (err, data) => {
//     if (err) {
//       callback(err);
//     } else {
//       console.log(data);
//       callback(null);
//     }
//   });
// };

// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { generateUniqueId } from "../modules/generateUniqueId/generateUniqueId.js";
// const client = new S3Client({ region: "us-east-2" });

// export const uploadBase64ToS3 = async (url, name, callback) => {
//   // get the type and extension
//   const filetypeAndExtension = url.substring(
//       url.indexOf(":") + 1,
//       url.indexOf(";")
//     ),
//     filetype = filetypeAndExtension.substring(
//       0,
//       filetypeAndExtension.indexOf("/")
//     ),
//     extension = filetypeAndExtension.substring(
//       filetypeAndExtension.indexOf("/") + 1
//     ),
//     file = url.substring(url.indexOf(",") + 1);

//   // create the filename
//   const fileName =
//     name !== undefined
//       ? `${name}.${extension}`
//       : `${generateUniqueId()}.${extension}`;

//   const command = new PutObjectCommand({
//     Bucket: "naddpod",
//     Key: fileName,
//     Body: new Buffer.from(file, "base64"),
//     ACL: "public-read",
//     ContentEncoding: "base64",
//     ContentType: filetypeAndExtension,
//   });

//   try {
//     const response = await client.send(command);
//     callback(null, fileName, response);
//   } catch (err) {
//     callback(err);
//   }
// };

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const uploadBase64ToS3 = async (base64, callback) => {
  // Configure AWS with your access and secret key.
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } =
    process.env;

  // Configure AWS to use promise
  // AWS.config.setPromisesDependency(require("bluebird"));
  // AWS.config.update({
  //   accessKeyId: AWS_ACCESS_KEY_ID,
  //   secretAccessKey: AWS_SECRET_ACCESS_KEY,
  //   region: AWS_REGION,
  // });

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
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Getting the file extension
  const extension = base64.split(";")[0].split("/")[1];

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
    callback(null, fileName, response);
  } catch (err) {
    callback(err);
  }
};
