import { uploadBase64ToS3 } from "../../apis/s3.js";
import { P } from "../../elements/elements.js";
import File from "../models/File.js";

const cloudfrontURL = process.env.CLOUDFRONTURL;

export const post__admin_files_retrieve = (req, res) => {
  File.find().exec((err, files) => {
    if (err) {
      console.log(err);
    } else {
      res.send(files);
    }
  });
};

export const post__admin_files_add = (req, res) => {
  const body = req.body,
    name = body.name,
    file = body.file;

  uploadBase64ToS3(file, (err, filename, extension, response) => {
    if (err) {
      console.log(err);
    } else {
      // assign the full path to the image as the src property
      const filepath = cloudfrontURL + "/" + filename;

      // and save the file to the database
      const file = new File({
        name,
        type: extension,
        filepath,
      });

      file.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send();
        }
      });
    }
  });
};

export const post__admin_files_delete = (req, res) => {
  const body = req.body,
    _id = body.id;

  File.findOneAndDelete({ _id }).exec((err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send();
    }
  });
};
