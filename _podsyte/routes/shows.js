import Show from "../models/Show.js";
import { camelize } from "../../modules/formatString/formatString.js";

export const post__admin_shows_retrieve = (req, res, next) => {
  Show.find().exec((err, shows) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(shows);
    }
  });
};

export const post__admin_shows_add = (req, res, next) => {
  const body = req.body;

  body.localPath = camelize(body.title);

  Show.findOneAndUpdate(
    {
      title: body.title,
    },
    {
      $set: body,
    },
    {
      upsert: true,
      new: true,
    }
  ).exec((err, event) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send("Show was successfully created");
  });
};

export const post__admin_shows_edit = (req, res, next) => {
  let body = req.body;

  body.localPath = camelize(body.title);

  Show.findOneAndUpdate(
    {
      title: body.title,
    },
    {
      $set: body,
    },
    {
      new: true,
    }
  ).exec((err, event) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send("Show was successfully updated");
  });
};
