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

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const client = new S3Client({ region: "us-east-2" });

export const uploadBase64ToS3 = async (url, filename, callback) => {
  // Getting the file type, ie: jpeg, png or gif
  const type = url.split(";")[0].split("/")[1],
    fileName = `${filename.toString()}.${type}`;

  const command = new PutObjectCommand({
    Bucket: "naddpod",
    Key: fileName,
    Body: new Buffer.from(
      url.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    ),
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  });

  try {
    const response = await client.send(command);
    callback(null, fileName, response);
  } catch (err) {
    callback(err);
  }
};
