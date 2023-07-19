import User from "./models/User.js";
import Page from "./models/Page.js";

import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectEnsureLogin from "connect-ensure-login";

import asyncLoop from "node-async-loop";
import Datapoint from "./models/Datapoint.js";

import { dashboard } from "./routes/dashboard.js";
import { get__admin_login, post__admin_login } from "./routes/login.js";
import { post__admin_signup } from "./routes/signup.js";
import { get__admin_logout } from "./routes/logout.js";
import {
  get__admin_tools,
  post__admin_tools_merchClubCSV,
} from "./routes/tools.routes.js";

import {
  get__admin_events,
  post__admin_events,
  post__admin_events_delete,
} from "./routes/events.js";
// import { fanart, post__fanartApprove } from "./routes/fanart.js";
import {
  get__admin_shows,
  post__admin_shows_add,
  post__admin_shows_edit,
} from "./routes/shows.js";
import { get__admin_global } from "./routes/global.js";
import {
  post__admin_datapoints,
  post__admin_datapoints_remove,
} from "./routes/datapoints.js";
import {
  get__admin_pages,
  get__admin_pages_$,
  post__admin_pages_add,
  post__admin_pages_retrieve,
} from "./routes/pages.js";
import { rez } from "./modules/rez.js";
import { camelize } from "../modules/formatString/formatString.js";
import { generateRoutes } from "./modules/generateRoutes.js";

export const init = ({
  app,
  express,
  __dirname,
  database,
  shows = true,
  events = true,
  fanart = true,
} = {}) => {
  /**
   * Authentication
   */

  app.use(
    session({
      secret: "carbineycarbineycarbine",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
      store: MongoStore.create({ mongoUrl: database }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(
    "/admin/styles",
    express.static(__dirname + "/periodic/dados/styles")
  );

  app.use(
    "/admin/scripts",
    express.static(__dirname + "/periodic/dados/scripts")
  );

  app.use(
    "/admin/modules",
    express.static(__dirname + "/periodic/dados/modules")
  );

  app.use(
    "/admin/templates",
    express.static(__dirname + "/periodic/dados/templates")
  );

  app.use(
    "/admin/images",
    express.static(__dirname + "/periodic/dados/images")
  );

  app.set("views", [__dirname + "/views", __dirname + "/periodic/dados/views"]);

  app.get(
    "/admin",
    connectEnsureLogin.ensureLoggedIn("/admin/login"),
    dashboard
  );

  // GLOBAL AND PAGES
  app.get(
    "/admin/global",
    connectEnsureLogin.ensureLoggedIn(),
    get__admin_global
  );

  app.get(
    "/admin/pages",
    connectEnsureLogin.ensureLoggedIn(),
    get__admin_pages
  );

  app.get(
    "/admin/pages/*",
    connectEnsureLogin.ensureLoggedIn(),
    get__admin_pages_$
  );

  app.post(
    "/admin/pages/retrieve",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_pages_retrieve
  );

  app.post(
    "/admin/pages/add",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_pages_add
  );

  app.get(
    "/admin/global",
    connectEnsureLogin.ensureLoggedIn(),
    get__admin_global
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

  if (shows) {
    // SHOWS
    app.get(
      "/admin/shows",
      connectEnsureLogin.ensureLoggedIn(),
      get__admin_shows
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
  }

  app.get(
    "/admin/tools",
    connectEnsureLogin.ensureLoggedIn(),
    get__admin_tools
  );

  app.post(
    "/admin/tools/merchClubCSV",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_tools_merchClubCSV
  );

  if (events) {
    // EVENTS
    app.get(
      "/admin/events",
      connectEnsureLogin.ensureLoggedIn(),
      get__admin_events
    );

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

  if (fanart) {
    console.log("enable fanart here!");
    // app.get("/admin/fanart", connectEnsureLogin.ensureLoggedIn(), fanart);
    // app.post(
    //   "/admin/fanart/approve",
    //   connectEnsureLogin.ensureLoggedIn(),
    //   post__fanartApprove
    // );
  }

  app.post("/admin/signup", post__admin_signup);
  app.get("/admin/login", get__admin_login);
  app.post("/admin/login", passport.authenticate("local"), post__admin_login);
  app.get("/admin/logout", get__admin_logout);

  // GENERATE USER ROUTES
  generateRoutes(app);
};
