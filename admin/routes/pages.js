import async from "async";
import Page from "../models/Page.js";
import Datapoint from "../models/Datapoint.js";
import { hyphenate } from "../../modules/formatString/formatString.js";
import { rez } from "../modules/rez.js";
import asyncLoop from "node-async-loop";
import mongoose from "mongoose";

export const get__admin_pages = (req, res, next) => {
  rez({
    req,
    res,
    template: "pages",
    data: { subtitle: "Pages", path: "/periodic/admin/pages" },
  });
};

export const post__admin_pages_add = (req, res, next) => {
  const body = req.body,
    pageId = req.body._id,
    path = body.path || "/" + hyphenate(body.name),
    name = body.name,
    description = body.description,
    wildcard = body.wildcard,
    homepage = body.homepage === "on";

  console.log(req.body);

  const pageData = {
    path,
    name,
    description,
    wildcard,
    homepage,
  };

  // check if we have an _id or not - if so, then we are updating
  // an existing page
  if (pageId !== undefined) {
    const _id = new mongoose.Types.ObjectId(pageId);

    // find and update this page
    Page.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: pageData,
      }
    ).exec((err, page) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(page._id);
      }
    });
  } else {
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
                callback(
                  "Page path is already taken. Please try another path."
                );
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
          Page.create(pageData, (err, page) => {
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
  }
};

export const post__admin_pages_retrieve = (req, res, next) => {
  Page.find().exec((err, pages) => {
    if (err) {
      callback(err);
    } else {
      // sort the pages alphabetically
      pages.sort(function (a, b) {
        const textA = a.name.toUpperCase(),
          textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      return res.status(200).send(pages);
    }
  });
};

export const get__admin_pages_$ = (req, res, next) => {
  const pageId = req.originalUrl
      .replace("/periodic/admin/pages/", "")
      .split("?")[0],
    _id = new mongoose.Types.ObjectId(pageId);

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
            data: {
              title: page.name,
              pageData: page,
              datapoints,
              path: `/admin/pages/${_id}`,
            },
          });
        });
      } else {
        rez({
          req,
          res,
          template: "page",
          data: {
            title: page.name,
            pageData: page,
            datapoints,
            path: `/admin/pages/${_id}`,
          },
        });
      }
    }
  });
};

export const post__admin_pages_getDatapoints = (req, res, next) => {
  const _id = req.body.pageId;

  Page.findOne({
    _id,
  }).exec((err, page) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // retrieve all of the datapoints for this page too
      const datapointIds = page.datapoints,
        datapoints = [];

      const retrieveDatapoints = (ids, parent, callback) => {
        asyncLoop(
          ids,
          (datapointId, next) => {
            Datapoint.findOne({ _id: datapointId }).exec(
              (err, originalDatapoint) => {
                const datapoint = { ...originalDatapoint._doc };
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
              }
            );
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

      retrieveDatapoints(datapointIds, datapoints, () => {
        return res.status(200).send(datapoints);
      });
    }
  });
};
