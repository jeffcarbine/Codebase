import Show from "../models/Show.js";
import { camelize } from "../../modules/formatString/formatString.js";
import Episode from "../models/Episode.js";
import { uploadBase64ToS3 } from "../../apis/s3.js";

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

export const post__admin_shows_episodes_retreive = (req, res) => {
  const showId = req.body.showId;

  Episode.find({ show: showId }).exec((err, episodes) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(episodes);
    }
  });
};

export const post__admin_shows_episode_edit = (req, res) => {
  const _id = req.body.episodeId,
    transcript = req.body.transcript;

  uploadBase64ToS3(transcript, (err, filepath) => {
    if (err) {
      console.log(err);
    } else {
      // and update the episode with the transcript
      Episode.findOneAndUpdate(
        { _id },
        { $set: { transcript: filepath } }
      ).exec((err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          return res.status(200).send("Transcript uploadeds successfully");
        }
      });
    }
  });
};
