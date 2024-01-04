import Page from "../models/Page.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { rez } from "./rez.js";
import async from "async";

import error from "../routes/error.js";
import asyncLoop from "node-async-loop";
import mongoose from "mongoose";

export const generateRoutes = (app) => {
  async.waterfall(
    [
      (callback) => {
        // get all of the pages from the database
        Page.find({}).exec((err, pages) => {
          // loop through each page

          if (pages.length > 0) {
            asyncLoop(
              pages,
              (page, next) => {
                const register = (next) => {
                  // register the route with express
                  app.get(path, (req, res) => {
                    rez({ req, res, template, data, datapointIds, page });
                  });

                  next();
                };

                // get the template, title, homepage and datapointIds fof this page
                const template = page.path.replace(/^\/+/, ""),
                  title = page.name,
                  datapointIds = page.datapoints,
                  homepage = page.homepage;

                // set the path value as / if homepage, otherwise
                // set it as path value
                let path = homepage ? "/" : page.path;

                // and if we are a wildcard, add theh /* to the path
                if (page.wildcard !== "none") {
                  path = path + "/*";
                }

                // construct the data object
                const data = { title, path, homepage };

                // check to see if we have any models, and if so retrieve all of their data from the database
                if (page.models.length > 0) {
                  // add the models object to the data object
                  data.models = {};

                  // loop through each model
                  asyncLoop(
                    page.models,
                    (model, nextModel) => {
                      // get the model from the database
                      mongoose
                        .model(model)
                        .find({})
                        .exec((err, modelData) => {
                          // add the data to the data object
                          data.models[`${model.toLowerCase()}s`] = modelData;

                          // move on to the next model
                          nextModel();
                        });
                    },
                    () => {
                      // register the route with express
                      register(next);
                    }
                  );
                } else {
                  // register the route with express
                  register(next);
                }
              },
              (err) => {
                if (err) {
                  callback(err);
                } else {
                  callback(null);
                }
              }
            );
          } else {
            console.log("No pages created yet");
          }
        });
      },
      () => {
        // 404 error page
        app.get("*", error);

        console.log("All routes successfully generated");
      },
    ],
    (err) => {
      console.log(err);
    }
  );
};
