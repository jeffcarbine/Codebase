import { dashboard } from "./routes/dashboard.js";
import { get__admin_login, post__admin_login } from "./routes/login.js";
import { get__admin_logout } from "./routes/logout.js";
import { get__admin_signup, post__admin_signup } from "./routes/signup.js";
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
  post__admin_datapoints_add,
  post__admin_datapoints_edit,
  post__admin_datapoints_retrieve,
} from "./routes/datapoints.js";
import { get__admin_global } from "./routes/global.js";

export const init = ({
  app,
  express,
  __dirname,
  passport,
  connectEnsureLogin,
  shows = true,
  events = true,
  fanart = true,
} = {}) => {
  app.use(
    "/admin/styles",
    express.static(__dirname + "/periodic/dados/styles")
  );

  app.use(
    "/admin/scripts",
    express.static(__dirname + "/periodic/dados/scripts")
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
    "/admin/datapoints/add",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datapoints_add
  );

  app.post(
    "/admin/datapoints/retrieve",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datapoints_retrieve
  );

  app.post(
    "/admin/datapoints/edit",
    connectEnsureLogin.ensureLoggedIn(),
    post__admin_datapoints_edit
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

  app.get("/admin/signup", get__admin_signup);
  app.post("/admin/signup", post__admin_signup);
  app.get("/admin/login", get__admin_login);
  app.post("/admin/login", passport.authenticate("local"), post__admin_login);
  app.get("/admin/logout", get__admin_logout);
};
