import { rez } from "../modules/rez.js";
import Setting from "../models/Setting.js";

export const get__admin_settings = (req, res) => {
  Setting.find().exec((err, settings) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return rez({
        req,
        res,
        template: "settings",
        data: {
          subtitle: "Settings",
          path: "/periodic/admin/settings",
          settings,
        },
      });
    }
  });
};

export const post__admin_settings = (req, res) => {
  const body = req.body,
    name = body.name;

  Setting.findOneAndUpdate(
    { name },
    { $set: body },
    { upsert: true, new: true }
  ).exec((err, setting) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(setting);
    }
  });
};

export const post__admin_settings_retrieve = (req, res) => {
  const name = req.body.name;

  Setting.find({ name }).exec((err, settings) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(settings);
    }
  });
};

export const post__admin_settings_retrieveAll = (req, res) => {
  Setting.find().exec((err, settings) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(settings);
    }
  });
};
