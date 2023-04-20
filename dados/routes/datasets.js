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

export const post__admin_datasets_add = (req, res, next) => {
  const body = req.body,
    name = body.name;

  if (body.restricted) {
    body.restricted = true;
  } else {
    body.restricted = false;
  }

  Dataset.create(body, (err, dataset) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send(dataset);
  });
};

export const get__admin_datasets_dataset_ = (req, res, next) => {
  const _id = req.originalUrl
    .replace("/admin/datasets/dataset/", "")
    .split("?")[0];

  Dataset.findOne({ _id }).exec((err, dataset) => {
    if (err) {
      callback(err);
    } else {
      res.render("dataset", {
        path: "/admin/datasets/dataset/" + dataset._id,
        subtitle: dataset.name,
        dataset,
      });
    }
  });
};

export const post__admin_datasets_dataset_edit = (req, res, next) => {
  const body = req.body,
    _id = req.body._id;

  if (body.restricted) {
    body.restricted = true;
  } else {
    body.restricted = false;
  }

  Dataset.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: body,
    }
  ).exec((err, dataset) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send(dataset);
  });
};
