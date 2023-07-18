import asyncLoop from "node-async-loop";
import Page from "../models/Page.js";
import Datapoint from "../models/Datapoint.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { splitAtNthInstance } from "../../modules/splitAtNthInstance/splitAtNthInstance.js";

import Episode from "../../models/Episode.js";
import Show from "../../models/Show.js";

export const rez = ({
  req,
  res,
  template,
  data = {},
  datapointIds = [],
  page,
} = {}) => {
  // check if we are logged in or not
  if (req.user) {
    data.loggedIn = true;
  } else {
    data.loggedIn = false;
  }

  // gives the route to the data
  data.points = {};

  // method for fetching datapoints for the page
  const fetchDatapoints = (datapointIds, callback) => {
    const datapoints = {};

    asyncLoop(
      datapointIds,
      (datapointId, next) => {
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

  // fetch datapoints if applicable
  if (page !== undefined && datapointIds.length > 0) {
    fetchDatapoints(datapointIds, (datapoints) => {
      // store the datapoints to the points key (haha so funny)
      data.points = datapoints;

      // if the page has a wildcard value, retrieve the
      // value from the database
      if (page.wildcard !== "none") {
        // if episode, retrieve episode
        if (page.wildcard === "episode") {
          // get the localpath from the wildcard
          const localPath = req.url
            .substring(req.url.lastIndexOf("/") + 1)
            .split("?")[0];

          Episode.findOne({
            localPath,
          }).exec((err, episode) => {
            if (err) {
              console.log(err);
              data.episode = {};
            } else {
              data.episode = episode;
            }

            res.render(template, data);
          });
          // otherwise, if podcast, retrieve podcast
        } else if (page.wildcard === "podcast") {
          // get the id for the show
          const _id = req.url
            .substring(req.url.lastIndexOf("/") + 1)
            .split("?")[0];

          Show.find({
            _id,
          }).exex((err, show) => {
            if (err) {
              console.log(err);
              data.podcast = {};
            } else {
              data.podcast = show;
            }

            res.render(template, data);
          });
        }
      } else {
        // and if nothing, render as normal
        res.render(template, data);
      }
    });
  } else {
    res.render(template, data);
  }
};
