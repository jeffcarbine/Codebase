import async from "async";
import Dataset from "../models/Dataset.js";
import Datapoint from "../models/Datapoint.js";

export const post__admin_datapoints_add = (req, res, next) => {
  const body = req.body,
    type = body.type,
    datasetId = body.datasetId;

  const newDatapoint = {
    type,
    datasetId,
  };

  newDatapoint[type] = {};

  for (let key in body) {
    if (key !== "datasetId" && key !== "type") {
      newDatapoint[type][key] = body[key];
    }
  }

  async.waterfall(
    [
      (callback) => {
        Datapoint.create(newDatapoint, (err, datapoint) => {
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
          }
        ).exec((err, dataset) => {
          if (err) {
            callback(err);
          } else {
            return res.status(200).send(dataset);
          }
        });
      },
    ],
    (err) => {
      return res.status(500).send(err);
    }
  );
};
