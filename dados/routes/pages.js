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
    wildcard = body.wildcard === "wildcard";

  const newPage = {
    path,
    name,
    wildcard,
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

      if (datapointIds.length > 0) {
        asyncLoop(
          datapointIds,
          (datapointId, next) => {
            Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
              datapoints.push(datapoint);
              next();
            });
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              rez({
                req,
                res,
                template: "page",
                data: { title: page.name, page, datapoints },
              });
            }
          }
        );
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
