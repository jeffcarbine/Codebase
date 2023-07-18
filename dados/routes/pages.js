import async from "async";
import Page from "../models/Page.js";
import Datapoint from "../models/Datapoint.js";
import { hyphenate } from "../../modules/formatString/formatString.js";
import { rez } from "../modules/rez.js";
import asyncLoop from "node-async-loop";

export const get__admin_pages = (req, res, next) => {
  rez({ req, res, template: "pages", data: { subtitle: "Pages" } });
};

export const post__admin_pages_add = (req, res, next) => {
  const body = req.body,
    path = "/" + (body.path || hyphenate(body.name)),
    name = body.name,
    wildcard = body.wildcard,
    homepage = body.homepage === "homepage";

  const newPage = {
    path,
    name,
    wildcard,
    homepage,
  };

  async.waterfall(
    [
      (callback) => {
        // first, let's check if there is page that already exists
        Page.findOne({ path }).exec((err, page) => {
          if (err) {
            callback(err);
          } else {
            if (page === null) {
              callback(null);
            } else {
              callback("Page name is already taken. Please try another name.");
            }
          }
        });
      },
      (callback) => {
        // if this is a new homepage, find the old one
        // and unset it

        if (homepage) {
          Page.findOneAndUpdate(
            {
              homepage: true,
            },
            { $set: { homepage: false } }
          ).exec((err) => {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      },
      (callback) => {
        Page.create(newPage, (err, page) => {
          if (err) {
            callback(err);
          } else {
            return res.status(200).send(page._id);
          }
        });
      },
    ],
    (err) => {
      return res.status(500).send(err);
    }
  );
};

export const post__admin_pages_retrieve = (req, res, next) => {
  Page.find().exec((err, pages) => {
    if (err) {
      callback(err);
    } else {
      return res.status(200).send(pages);
    }
  });
};

export const get__admin_pages_$ = (req, res, next) => {
  const _id = req.originalUrl.replace("/admin/pages/", "").split("?")[0];

  Page.findOne({
    _id,
  }).exec((err, page) => {
    if (err) {
      console.log(err);
    } else {
      // retrieve all of the datapoints for this page too
      const datapointIds = page.datapoints,
        datapoints = [];

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

      if (datapointIds.length > 0) {
        retrieveDatapoints(datapointIds, datapoints, () => {
          rez({
            req,
            res,
            template: "page",
            data: { title: page.name, page, datapoints },
          });
        });
      } else {
        rez({
          req,
          res,
          template: "page",
          data: { title: page.name, page, datapoints },
        });
      }
    }
  });
};
