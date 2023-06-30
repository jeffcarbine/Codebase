import asyncLoop from "node-async-loop";
import Page from "../models/Page.js";
import Datapoint from "../models/Datapoint.js";
import { camelize } from "../../modules/formatString/formatString.js";

export const rez = ({
  req,
  res,
  template,
  data = {},
  datapointIds = [],
} = {}) => {
  //console.log(req.url);

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

  //console.log(datapointIds);

  const fetchDatapoints = (datapointIds, callback) => {
    const datapoints = {};

    asyncLoop(
      datapointIds,
      (datapointId, next) => {
        // console.log(`Next datapoint id!`);
        // console.log(datapointId);

        // i'm not 100% sure why we are getting undefeined datapointIds
        // in our lists, but hopefully this will skip them and
        // allow the page to still render
        if (datapointId !== undefined) {
          Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
            const type = datapoint.type,
              datapointData = datapoint[type];

            if (type === "group" && datapointData.length > 0) {
              // then we need to recursively find the datapoints
              // in the group
              // console.log(`${datapointId} is a group`);
              // console.log(`This is ${datapointId}'s data:`);
              // console.log(datapointData);
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
        } else {
          next();
        }
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
};
