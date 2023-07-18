import Page from "../models/Page.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { rez } from "./rez.js";

export const generateRoutes = (app) => {
  // get all of the pages from the database
  Page.find({}).exec((err, pages) => {
    // loop through each page
    pages.forEach((page) => {
      // get the template, title, homepage and datapointIds fof this page
      const template = camelize(page.name.toLowerCase()),
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
    });
  });
};
