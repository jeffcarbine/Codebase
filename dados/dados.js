import User from "./models/User.js";
import Page from "./models/Page.js";

import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectEnsureLogin from "connect-ensure-login";

import { dashboard } from "./routes/dashboard.js";
import { get__admin_login, post__admin_login } from "./routes/login.js";
import { post__admin_signup } from "./routes/signup.js";
import { get__admin_logout } from "./routes/logout.js";
import {
  get__admin_events,
  post__admin_events_add,
  post__admin_events_edit,
  post__admin_events_delete,
} from "./routes/events.js";
// import { fanart, post__fanartApprove } from "./routes/fanart.js";
import {
  get__admin_shows,
  post__admin_shows_add,
  post__admin_shows_edit,
} from "./routes/shows.js";
import {
  post__admin_datasets_add,
  post__admin_datasets_retrieve,
  get__admin_datasets_dataset_,
  post__admin_datasets_dataset_edit,
} from "./routes/global.js";
import {
  post__admin_datapoints,
  post__admin_datapoints_remove,
} from "./routes/datapoints.js";

import { get__admin_global } from "./routes/global.js";
import {
  get__admin_pages,
  get__admin_pages_$,
  post__admin_pages_add,
  post__admin_pages_retrieve,
} from "./routes/pages.js";
import { rez } from "./modules/rez.js";
import { camelize } from "../modules/formatString/formatString.js";

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

  app.post(
    "/admin/datasets/retrieve",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datasets_retrieve
  );

  app.post(
    "/admin/datasets/add",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datasets_add
  );

  app.get(
    "/admin/datasets/dataset/*",
    connectEnsureLogin.ensureLoggedIn(),
    get__admin_datasets_dataset_
  );

  app.post(
    "/admin/datasets/dataset/edit",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datasets_dataset_edit
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

  if (events) {
    // EVENTS
    app.get(
      "/admin/events",
      connectEnsureLogin.ensureLoggedIn(),
      get__admin_events
    );

    app.post(
      "/admin/events/add",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_events_add
    );

    app.post(
      "/admin/events/edit",
      connectEnsureLogin.ensureLoggedIn(),
      post__admin_events_edit
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

  // GENERATE ROUTES FROM PAGES
  app.get("*", (req, res) => {
    const path = req.url;

    Page.findOne({
      path,
    }).exec((err, page) => {
      let template, title, datapoints;

      if (err || page === null) {
        template = "error";
        title = "Page Not Found";
      } else {
        template = camelize(page.name.toLowerCase());
        title = page.name;
        datapoints = page.datapoints;
      }

      console.log(template);

      rez({ req, res, template, data: { title }, datapoints });
    });
  });
};
