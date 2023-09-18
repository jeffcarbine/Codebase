import passport from "passport";
import connectEnsureLogin from "connect-ensure-login";

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
} from "../routes/datapoints.js";

import {
  post__admin_pages,
  post__admin_pages_retrieve,
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
    dashboard: "Dashboard",
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
      path = `/admin/${route}`;

    if (route === "dashboard") {
      path = "/admin";
    }

    if (route === "page") {
      path = "/admin/pages/*";
    }

    app.get(
      path,
      connectEnsureLogin.ensureLoggedIn("/admin/login"),
      (req, res) => {
        rez({
          req,
          res,
          template,
          __dirname,
          viewPath: "/periodic/_podsyte/views",
          data: { title, path, features },
        });
      }
    );
  }

  // the login/signup routes
  app.get("/admin/login", get__admin_login);

  app.post(
    "/admin/pages/retrieve",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_pages_retrieve
  );

  app.post(
    "/admin/pages",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_pages
  );

  // DATAPOINTS
  app.post(
    "/admin/datapoints",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datapoints
  );

  app.post(
    "/admin/datapoints/remove",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datapoints_remove
  );

  // SHOWS
  app.post(
    "/admin/shows/retrieve",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_shows_retrieve
  );

  app.post(
    "/admin/shows/add",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_shows_add
  );

  app.post(
    "/admin/shows/edit",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_shows_edit
  );

  app.post(
    "/admin/tools/merchClubCSV",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_tools_merchClubCSV
  );

  // app.post(
  //   "/admin/settings",
  //   connectEnsureLogin.ensureLoggedIn(),
  //   post__admin_settings
  // );

  // app.post(
  //   "/admin/settings/retrieve",
  //   connectEnsureLogin.ensureLoggedIn(),
  //   post__admin_settings_retrieve
  // );

  // app.post(
  //   "/admin/settings/retrieve-all",
  //   connectEnsureLogin.ensureLoggedIn(),
  //   post__admin_settings_retrieveAll
  // );

  if (features.events) {
    app.post(
      "/admin/events",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_events
    );

    app.post(
      "/admin/events/delete",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_events_delete
    );
  }

  if (features.fanart) {
    app.post(
      "/admin/fanart/approve",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_fanart_approve
    );

    app.post(
      "/admin/fanart/retrieve",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_fanart_retrieve
    );

    app.post(
      "/admin/fanart/delete",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_fanart_delete
    );
  }

  app.post("/admin/signup", post__admin_signup);
  app.post("/admin/login", passport.authenticate("local"), post__admin_login);
};
