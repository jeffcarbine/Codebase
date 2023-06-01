import Datapoint from "../models/Datapoint.js";
import { rez } from "../modules/rez.js";
import asyncLoop from "node-async-loop";

export const get__admin_global = (req, res, next) => {
  Datapoint.find({
    global: true,
  }).exec((err, datapoints) => {
    if (err) {
      console.log(err);
    } else {
      const retrieveDatapoints = (ids, parent, callback) => {
        asyncLoop(
          ids,
          (datapointId, next) => {
            Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
              parent.push(datapoint);

              // check if the datapoint is a group
              if (datapoint.type === "group") {
                datapoint.datapoints = [];

                if (datapoint.group.length > 0) {
                  // then we need to retrieve the children datapoints
                  retrieveDatapoints(
                    datapoint.group,
                    datapoint.datapoints,
                    next
                  );
                } else {
                  next();
                }
              } else {
                next();
              }
            });
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              callback();
            }
          }
        );
      };

      if (datapoints.length > 0) {
        asyncLoop(
          datapoints,
          (datapoint, next) => {
            if (datapoint.type === "group" && datapoint.group.length > 0) {
              // then we need to retrieve the datapoints
              // in this group
              datapoint.datapoints = [];
              retrieveDatapoints(datapoint.group, datapoint.datapoints, next);
            } else {
              next();
            }
          },
          (err) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              return rez({
                req,
                res,
                template: "global",
                data: { datapoints },
              });
            }
          }
        );
      } else {
        console.log("no datapoints");
        return rez({
          req,
          res,
          template: "global",
          data: { datapoints: [] },
        });
      }
    }
  });
};
