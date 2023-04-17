import Dataset from "../models/Dataset.js";

export const get__admin_datasets = (req, res, next) => {
  const now = new Date();

  Dataset.aggregate([
    {
      $match: {
        date: {
          $gt: now,
        },
      },
    },
  ]).exec((err, events) => {
    if (err) {
      callback(err);
    } else {
      // sort the events by date
      events.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      res.render("datasets", {
        path: "/admin/datasets",
        subtitle: "Datasets",
        events,
      });
    }
  });
};

export const post__admin_datasets_add = (req, res, next) => {
  let body = req.body;
  body.date = new Date(req.body.date);

  Dataset.findOneAndUpdate(
    {
      date: body.date,
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

    return res.status(200).send("Dataset was successfully created!");
  });
};
