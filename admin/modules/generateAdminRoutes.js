import passport from "passport";
import connectEnsureLogin from "connect-ensure-login";
import mongoose from "mongoose";
import Page from "../models/Page.js";
import Show from "../models/Show.js";

import { get__admin_login, post__admin_login } from "../routes/login.js";
import { get__admin_logout } from "../routes/logout.js";
import { post__admin_signup } from "../routes/signup.js";
import { post__admin_tools_merchClubCSV } from "../routes/tools.routes.js";

import {
  post__admin_events,
  post__admin_events_delete,
  post__admin_events_retrieve,
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
  post__admin_shows_episodes_retreive,
  post__admin_shows_episode_edit,
} from "../routes/shows.routes.js";

import {
  post__admin_datapoints,
  post__admin_datapoints_addExisting,
  post__admin_datapoints_remove,
  post__admin_datapoints_retrieve,
  post__admin_datapoints_retrieve_all,
} from "../routes/datapoints.js";

import {
  post__admin_pages_add,
  post__admin_pages_retrieve,
  post__admin_pages_getDatapoints,
} from "../routes/pages.js";

import {
  post__admin_files_add,
  post__admin_files_retrieve,
  post__admin_files_delete,
} from "../routes/files.routes.js";

// import {
//   get__admin_settings,
//   post__admin_settings,
//   post__admin_settings_retrieve,
//   post__admin_settings_retrieveAll,
// } from "./routes/settings.routes.js";

import { rez } from "./rez.js";

export const generateAdminRoutes = (app, __dirname, features) => {
  const getRoutes = {
    //dashboard: "Dashboard",
    global: "Global",
    pages: "Pages",
    page: "Page",
    files: "Files",
    shows: "Shows",
    show: "Show",
    tools: "Tools",
  };

  if (features.events) {
    getRoutes.events = "Events";
  }

  if (features.fanart) {
    getRoutes.fanart = "Fanart";
  }

  if (features.rewards) {
    getRoutes.rewards = "Rewards";
    getRoutes.members = "Members";
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

    if (route === "show") {
      path = "/periodic/admin/shows/*";
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
        } else if (route === "show") {
          // get the show data
          // get the page data
          const pageId = req.originalUrl
              .replace("/periodic/admin/shows/", "")
              .split("?")[0],
            _id = new mongoose.Types.ObjectId(pageId);

          Show.findOne({ _id }).exec((err, show) => {
            data.title = show.title;
            data.pageData = show;

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

  // the login/logout/signup routes
  app.get("/periodic/admin/login", get__admin_login);
  app.get("/periodic/admin/logout", get__admin_logout);

  app.post(
    "/periodic/admin/pages/retrieve",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_pages_retrieve
  );

  app.post(
    "/periodic/admin/pages/add",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_pages_add
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
    "/periodic/admin/datapoints/addExisting",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_datapoints_addExisting
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

  app.post(
    "/periodic/admin/datapoints/retrieve/all",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_datapoints_retrieve_all
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
    "/periodic/admin/shows/episodes/retrieve",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_shows_episodes_retreive
  );

  app.post(
    "/periodic/admin/shows/episode/edit",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_shows_episode_edit
  );

  app.post(
    "/periodic/admin/tools/merchClubCSV",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_tools_merchClubCSV
  );

  // FILES
  app.post(
    "/periodic/admin/files/retrieve",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_files_retrieve
  );

  app.post(
    "/periodic/admin/files/add",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_files_add
  );

  app.post(
    "/periodic/admin/files/delete",
    connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
    post__admin_files_delete
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
      "/periodic/admin/events/retrieve",
      connectEnsureLogin.ensureLoggedIn("/periodic/admin/login"),
      post__admin_events_retrieve
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

  if (features.rewards) {
    // rewards routes here
  }

  app.post("/periodic/admin/signup", post__admin_signup);
  app.post(
    "/periodic/admin/login",
    passport.authenticate("local"),
    post__admin_login
  );
};
