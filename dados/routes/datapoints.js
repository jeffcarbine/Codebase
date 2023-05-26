import async from "async";
import Dataset from "../models/Dataset.js";
import Datapoint from "../models/Datapoint.js";
import Page from "../models/Page.js";

export const post__admin_datapoints_add = (req, res, next) => {
  const body = req.body,
    pageId = req.body.pageId;

  console.log(body);

  async.waterfall(
    [
      (callback) => {
        Datapoint.create(body, (err, datapoint) => {
          if (err) {
            callback(err);
          } else {
            callback(null, datapoint);
          }
        });
      },
      (datapoint) => {
        Page.findOneAndUpdate(
          {
            _id: pageId,
          },
          {
            $addToSet: {
              datapoints: {
                id: datapoint._id,
                name: datapoint.name,
              },
            },
          },
          {
            new: true,
          }
        ).exec((err, dataset) => {
          if (err) {
            callback(err);
          } else {
            return res.status(200).send(dataset.datapoints);
          }
        });
      },
    ],
    (err) => {
      return res.status(500).send(err);
    }
  );
};

export const post__admin_datapoints_retrieve = (req, res, next) => {
  const datapointIds = req.body;

  Datapoint.find({
    _id: {
      $in: datapointIds,
    },
  }).exec((err, datapoints) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(datapoints);
    }
  });
};

export const post__admin_datapoints_edit = (req, res, next) => {
  const body = req.body,
    type = body.type,
    datasetId = body.datasetId,
    name = body.name,
    _id = body._id;

  const newDatapoint = {
    type,
    datasetId,
    name,
  };

  newDatapoint[type] = {};

  for (let key in body) {
    if (key !== "datasetId" && key !== "type") {
      newDatapoint[type][key] = body[key];
    }
  }

  console.log(newDatapoint);

  async.waterfall(
    [
      (callback) => {
        Datapoint.findOneAndUpdate(
          {
            _id,
          },
          {
            $set: newDatapoint,
          }
        ).exec((err, datapoint) => {
          if (err) {
            callback(err);
          } else {
            callback(null, datapoint);
          }
        });
      },
      (datapoint) => {
        Dataset.findOneAndUpdate(
          {
            _id: datasetId,
          },
          {
            $addToSet: {
              datapoints: datapoint._id,
            },
          },
          {
            new: true,
          }
        ).exec((err, dataset) => {
          if (err) {
            callback(err);
          } else {
            return res.status(200).send(dataset.datapoints);
          }
        });
      },
    ],
    (err) => {
      return res.status(500).send(err);
    }
  );
};
