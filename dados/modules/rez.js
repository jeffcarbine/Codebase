import asyncLoop from "node-async-loop";
import Page from "../models/Page.js";
import Datapoint from "../models/Datapoint.js";
import { camelize } from "../../modules/formatString/formatString.js";

export const rez = ({ req, res, template, data = {} } = {}) => {
  // check if we are logged in or not
  if (req.user) {
    data.loggedIn = true;
  } else {
    data.loggedIn = false;
  }

  // gives the route to the data
  const path = req.url.split("?")[0];
  data.path = path;
  data.points = {};
  // console.log(template);
  // console.log(data);

  // fetch all datapoints associated to this route
  Page.findOne({ path }).exec((err, page) => {
    if (err) {
      console.log(err);
    } else {
      if (page !== null && page.datapoints.length > 0) {
        const datapointIds = page.datapoints;

        const fetchDatapoints = (datapointIds, callback) => {
          const datapoints = {};

          asyncLoop(
            datapointIds,
            (datapointId, next) => {
              Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
                const type = datapoint.type,
                  datapointData = datapoint[type];

                if (type === "group" && datapointData.length > 0) {
                  // then we need to recursively find the datapoints
                  // in the group
                  fetchDatapoints(datapointData, (groupDatapoints) => {
                    datapoints[camelize(datapoint.name)] = {
                      name: datapoint.name,
                      group: groupDatapoints,
                    };

                    next();
                  });
                } else {
                  datapoints[camelize(datapoint.name)] = datapointData;
                  next();
                }
              });
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                callback(datapoints);
              }
            }
          );
        };

        fetchDatapoints(datapointIds, (datapoints) => {
          data.points = datapoints;
          res.render(template, data);
        });
      } else {
        res.render(template, data);
      }
    }
  });
};
