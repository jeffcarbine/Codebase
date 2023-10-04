import asyncLoop from "node-async-loop";
import async from "async";
import Page from "../models/Page.js";
import Datapoint from "../models/Datapoint.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { splitAtNthInstance } from "../../modules/splitAtNthInstance/splitAtNthInstance.js";

import Episode from "../models/Episode.js";
import Show from "../models/Show.js";

import { shopify, formatProduct } from "../../apis/shopify.js";

export const rez = ({
  req,
  res,
  template,
  data = {},
  datapointIds = [],
  page,
  __dirname,
  viewPath,
} = {}) => {
  // check if we are logged in or not
  if (req.user) {
    data.loggedIn = true;
  } else {
    data.loggedIn = false;
  }

  // set up the points and the global values
  data.page = {};
  data.global = {};

  // method for fetching datapoints for the page
  const fetchDatapoints = (datapointIds, callback, isArray = false) => {
    let datapoints;

    if (isArray) {
      datapoints = [];
    } else {
      datapoints = {};
    }

    asyncLoop(
      datapointIds,
      (datapointId, next) => {
        // i'm not 100% sure why we are getting undefeined datapointIds
        // in our lists, but hopefully this will skip them and
        // allow the page to still render
        if (datapointId !== undefined && datapointId !== "") {
          Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
            const type = datapoint.type,
              datapointData = datapoint[type];

            const processDatapoint = () => {
              if (type === "group" && datapointData.length > 0) {
                // then we need to recursively find the datapoints
                // in the group

                let childIsArray = datapoint.groupType === "array";

                fetchDatapoints(
                  datapointData,
                  (groupDatapoints) => {
                    const childDatapoint = {
                      name: datapoint.name,
                      group: groupDatapoints,
                    };

                    if (isArray) {
                      datapoints.push(childDatapoint);
                    } else {
                      datapoints[camelize(datapoint.name)] = childDatapoint;
                    }

                    next();
                  },
                  childIsArray
                );
              } else {
                if (isArray) {
                  datapoints.push(datapoint);
                } else {
                  datapoints[camelize(datapoint.name)] = datapoint;
                }
                next();
              }
            };

            // check if this datapoint has a wildcard, and if so
            // make sure it matches the wildcard for this page
            if (
              datapoint.groupWildcard !== "" &&
              datapoint.groupWildcard !== undefined
            ) {
              const groupWildcard = datapoint.groupWildcard,
                wildcard = req.url
                  .substring(req.url.lastIndexOf("/") + 1)
                  .split("?")[0];

              if (groupWildcard === wildcard) {
                processDatapoint();
              } else {
                next();
              }
            } else {
              processDatapoint();
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

  async.waterfall(
    [
      // step 1: get all page datapoints
      (callback) => {
        // fetch datapoints if applicable
        if (page !== undefined && datapointIds.length > 0) {
          fetchDatapoints(datapointIds, (datapoints) => {
            // store the datapoints to the page key
            data.page = datapoints;

            callback(null);
          });
        } else {
          callback(null);
        }
      },
      // step 2: get all global datapoints
      (callback) => {
        Datapoint.find({ global: true }).exec((err, globalDatapoints) => {
          // for simplicity, we get the ids and then re-fetch the datapoints
          const datapointIds = globalDatapoints.map((datapoint) => {
            return datapoint._id;
          });

          // if we have global datapoints, handle them
          if (datapointIds.length > 0) {
            fetchDatapoints(datapointIds, (datapoints) => {
              data.global = datapoints;

              callback(null);
            });
          } else {
            callback(null);
          }
        });
      },
      // step 3: if wildcard, get wildcard value
      (callback) => {
        // if the page has a wildcard value, retrieve the
        // value from the database
        if (page !== undefined && page.wildcard !== "none") {
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
                return res.status(500).send(err);
              }

              if (episode === null) {
                data.episode = {};
                data.template = "error";
                data.title = "Page Not Found";
                callback(null);
              } else {
                data.episode = episode;
                data.path = data.path.replace("*", localPath);
                data.title = episode.title;

                // now, we need to get all the episodes from
                // this series, sort them by date and then
                // get the two episodes before/after this one
                // to get the previous/next episode links/titles

                // query by series if available, or just get all episodes if
                // we don't use series for this client
                const query =
                  episode.series !== undefined
                    ? { series: episode.series }
                    : {};

                Episode.find(query, {}, { sort: { pubDate: -1 } }).exec(
                  (err, episodes) => {
                    // get the total number of indexes
                    const indexes = episodes.length - 1,
                      episodeIndex = episodes.findIndex(
                        (e) => e.localPath == episode.localPath
                      ),
                      prevEpisodeIndex = episodeIndex + 1,
                      nextEpisodeIndex = episodeIndex - 1;

                    data.prevEpisode =
                      prevEpisodeIndex > indexes
                        ? null
                        : episodes[prevEpisodeIndex];

                    data.nextEpisode =
                      nextEpisodeIndex < 0 ? null : episodes[nextEpisodeIndex];

                    callback(null);
                  }
                );
              }
            });
            // otherwise, if podcast, retrieve podcast
          } else if (page.wildcard === "podcast") {
            // get the id for the show
            const localPath = req.url
              .substring(req.url.lastIndexOf("/") + 1)
              .split("?")[0];

            Show.findOne({
              localPath,
            }).exec((err, show) => {
              if (err) {
                console.log(err);
                data.template = "error"; // render the error template instead
                data.podcast = {};
              } else {
                data.podcast = show;
              }

              if (show !== null) {
                data.path = data.path.replace("*", localPath);
                data.title = show.title;
              } else {
                data.title = "Page Not Found";
                template = "error";
              }

              callback(null);
            });
          } else if (page.wildcard === "collection") {
            async.waterfall(
              [
                (subCallback) => {
                  const collectionHandle = req.originalUrl.replace(
                    "/shop/collection/",
                    ""
                  );

                  subCallback(null, collectionHandle);
                },
                (collectionHandle, subCallback) => {
                  shopify.collection
                    .fetchByHandle(collectionHandle)
                    .then((collection) => {
                      const collectionId = collection.id;

                      subCallback(null, collectionId, collectionHandle);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                },
                (collectionId, collectionHandle, subCallback) => {
                  shopify.collection
                    .fetchWithProducts(collectionId, { productsFirst: 200 }) // can't do more than 200 it seems
                    .then((collection) => {
                      subCallback(null, collection, collectionHandle);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                },
                (collection, collectionHandle) => {
                  data.collection = collection;
                  data.path = data.path.replace("*", collectionHandle);
                  data.title = collection.title;
                  callback(null);
                },
              ],
              function (err) {
                if (err) {
                  return res.status(500).send(err);
                }
              }
            );
          } else if (page.wildcard === "product") {
            async.waterfall(
              [
                (subCallback) => {
                  // get the product handle via the url, scraping any query strings
                  const productHandle = req.originalUrl
                    .replace("/shop/product/", "")
                    .split("?")[0];
                  subCallback(null, productHandle);
                },
                (productHandle, subCallback) => {
                  shopify.product
                    .fetchByHandle(productHandle)
                    .then((product) => {
                      if (product !== null) {
                        let formattedProduct = formatProduct(product);
                        subCallback(null, formattedProduct, productHandle);
                      } else {
                        subCallback("No product found");
                      }
                    });
                },
                (formattedProduct, productHandle) => {
                  data.product = formattedProduct;
                  data.path = data.path.replace("*", [productHandle]);
                  data.title = formattedProduct.name;

                  callback(null);
                },
              ],
              (err) => {
                if (err) {
                  return res.status(500).send(err);
                }
              }
            );
          }
        } else {
          callback(null);
        }
      },
      // step 4: render
      () => {
        if (__dirname) {
          res.render(`${__dirname}/${viewPath}/${template}`, data);
        } else {
          res.render(template, data);
        }
      },
    ],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};
