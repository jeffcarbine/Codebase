import Page from "../models/Page.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { rez } from "./rez.js";
import async from "async";

import error from "../routes/error.js";
import asyncLoop from "node-async-loop";

export const generateRoutes = (app) => {
  async.waterfall(
    [
      (callback) => {
        // get all of the pages from the database
        Page.find({}).exec((err, pages) => {
          // loop through each page

          asyncLoop(
            pages,
            (page, next) => {
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

              // now register the route with express
              app.get(path, (req, res) => {
                rez({ req, res, template, data, datapointIds, page });
              });

                next();
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
