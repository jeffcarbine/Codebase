import passport from "passport";
import connectEnsureLogin from "connect-ensure-login";
import mongoose from "mongoose";
import Page from "../models/Page.js";

import { get__admin_login, post__admin_login } from "../routes/login.js";
import { post__admin_signup } from "../routes/signup.js";
import { post__admin_tools_merchClubCSV } from "../routes/tools.routes.js";

import {
  post__admin_events,
  post__admin_events_delete,
} from "../routes/events.js";

import {
  post__admin_fanart_approve,
  post__admin_fanart_delete,
  post__admin_fanart_retrieve,
} from "../routes/fanart.routes.js";

import {
  post__admin_shows_retrieve,
  post__admin_shows_add,
  post__admin_shows_edit,
} from "../routes/shows.js";

import {
  post__admin_datapoints,
  post__admin_datapoints_remove,
  post__admin_datapoints_retrieve,
} from "../routes/datapoints.js";

import {
  post__admin_pages,
  post__admin_pages_retrieve,
  post__admin_pages_getDatapoints,
} from "../routes/pages.js";

// import {
//   get__admin_settings,
//   post__admin_settings,
//   post__admin_settings_retrieve,
//   post__admin_settings_retrieveAll,
// } from "./routes/settings.routes.js";

import { rez } from "./rez.js";
import { connect } from "mongoose";

export const generateAdminRoutes = (app, __dirname, features) => {
  const getRoutes = {
    //dashboard: "Dashboard",
    global: "Global",
    pages: "Pages",
    page: "Page",
    files: "Files",
    shows: "Shows",
    tools: "Tools",
  };

  if (features.events) {
    getRoutes.events = "Events";
  }

  if (features.fanart) {
    getRoutes.fanart = "Fanart";
  }

  for (let route in getRoutes) {
    const title = getRoutes[route];

    let template = route,
      path = `/periodic/admin/${route}`;

    // if (route === "dashboard") {
    //   path = "/periodic/admin";
    // }

    if (route === "page") {
      path = "/periodic/admin/pages/*";
    }

    app.get(
      path,
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      (req, res) => {
        let data = { title, path, features };

        const adminRez = () => {
          rez({
            req,
            res,
            template,
            __dirname,
            viewPath: "/periodic/admin/views",
            data,
          });
        };

        // if page, get the page data
        if (route === "page") {
          // get the page data
          const pageId = req.originalUrl
              .replace("/periodic/admin/pages/", "")
              .split("?")[0],
            _id = new mongoose.Types.ObjectId(pageId);

          Page.findOne({ _id }).exec((err, page) => {
            data.title = page.name;
            data.pageData = page;

            adminRez();
          });
        } else {
          adminRez();
        }
      }
    );
  }

  // default admin -> periodic/admin/pages route
  app.get(
    "/admin",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    (req, res) => {
      res.redirect("/periodic/admin/pages");
    }
  );

  app.get(
    "/periodic/admin",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    (req, res) => {
      res.redirect("/periodic/admin/pages");
    }
  );

  // the login/signup routes
  app.get("/periodic/admin/login", get__admin_login);

  app.post(
    "/periodic/admin/pages/retrieve",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_pages_retrieve
  );

  app.post(
    "/periodic/admin/pages",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_pages
  );

  app.post(
    "/periodic/admin/pages/getDatapoints",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_pages_getDatapoints
  );

  // DATAPOINTS
  app.post(
    "/periodic/admin/datapoints",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_datapoints
  );

  app.post(
    "/periodic/admin/datapoints/remove",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_datapoints_remove
  );

  app.post(
    "/periodic/admin/datapoints/retrieve",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_datapoints_retrieve
  );

  // SHOWS
  app.post(
    "/periodic/admin/shows/retrieve",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_shows_retrieve
  );

  app.post(
    "/periodic/admin/shows/add",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_shows_add
  );

  app.post(
    "/periodic/admin/shows/edit",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_shows_edit
  );

  app.post(
    "/periodic/admin/tools/merchClubCSV",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_tools_merchClubCSV
  );

  // app.post(
  //   "/periodic/admin/settings",
  //   connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
  //   post__admin_settings
  // );

  // app.post(
  //   "/periodic/admin/settings/retrieve",
  //   connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
  //   post__admin_settings_retrieve
  // );

  // app.post(
  //   "/periodic/admin/settings/retrieve-all",
  //   connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
  //   post__admin_settings_retrieveAll
  // );

  if (features.events) {
    app.post(
      "/periodic/admin/events",
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      post__admin_events
    );

    app.post(
      "/periodic/admin/events/delete",
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      post__admin_events_delete
    );
  }

  if (features.fanart) {
    app.post(
      "/periodic/admin/fanart/approve",
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      post__admin_fanart_approve
    );

    app.post(
      "/periodic/admin/fanart/retrieve",
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      post__admin_fanart_retrieve
    );

    app.post(
      "/periodic/admin/fanart/delete",
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      post__admin_fanart_delete
    );
  }

  app.post("/periodic/admin/signup", post__admin_signup);
  app.post(
    "/periodic/admin/login",
    passport.authenticate("local"),
    post__admin_login
  );
};
