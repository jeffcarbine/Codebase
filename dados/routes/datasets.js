import Dataset from "../models/Dataset.js";

export const get__admin_datasets = (req, res, next) => {
  res.render("datasets", {
    path: "/admin/datasets",
    subtitle: "Datasets",
  });
};

export const post__admin_datasets_retrieve = (req, res, next) => {
  Dataset.find().exec((err, datasets) => {
    if (err) {
      return res.status(500).send();
    } else {
      return res.status(200).send(datasets);
    }
  });
};

export const get__admin_datasets_any = (req, res, next) => {
  const _id = req.originalUrl.replace("/admin/datasets/", "").split("?")[0];

  Dataset.findOne({ _id }).exec((err, dataset) => {
    if (err) {
      callback(err);
    } else {
      res.render("dataset", {
        path: "/admin/datasets/" + dataset._id,
        subtitle: dataset.name,
        dataset,
      });
    }
  });
};

export const post__admin_datasets_add = (req, res, next) => {
  const body = req.body,
    name = body.name;

  if (body.restricted) {
    body.restricted = true;
  }

  console.log(body);

  Dataset.findOneAndUpdate(
    {
      name,
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
