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
  const path = req.url;
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

        asyncLoop(
          datapointIds,
          (datapointId, next) => {
            Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
              const type = datapoint.type,
                datapointData = datapoint[type];
              data.points[camelize(datapoint.name)] = datapointData;
              next();
            });
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              res.render(template, data);
            }
          }
        );
      } else {
        res.render(template, data);
      }
    }
  });
};
