import { dashboard } from "./routes/dashboard.js";
import { get__backstage_login, post__backstage_login } from "./routes/login.js";
import { get__backstage_logout } from "./routes/logout.js";
import {
  get__backstage_signup,
  post__backstage_signup,
} from "./routes/signup.js";
import {
  get__backstage_events,
  post__backstage_events_add,
  post__backstage_events_edit,
  post__backstage_events_delete,
} from "./routes/events.js";
// import { fanart, post__fanartApprove } from "./routes/fanart.js";
import {
  get__backstage_shows,
  post__backstage_shows_add,
  post__backstage_shows_edit,
} from "./routes/shows.js";
import { get__backstage_pages } from "./routes/pages.js";
import { get__backstage_widgets } from "./routes/widgets.js";

export const backstage = (
  app,
  express,
  __dirname,
  passport,
  connectEnsureLogin
) => {
  app.use(
    "/backstage/styles",
    express.static(__dirname + "/periodic/backstage/styles")
  );

  app.use(
    "/backstage/scripts",
    express.static(__dirname + "/periodic/backstage/scripts")
  );

  app.use(
    "/backstage/images",
    express.static(__dirname + "/periodic/backstage/images")
  );

  app.set("views", [
    __dirname + "/views",
    __dirname + "/periodic/backstage/views",
  ]);

  app.get(
    "/backstage",
    connectEnsureLogin.ensureLoggedIn("/backstage/login"),
    dashboard
  );

  // PAGES
  app.get(
    "/backstage/pages",
    connectEnsureLogin.ensureLoggedIn(),
    get__backstage_pages
  );

  // WIDGETS
  app.get(
    "/backstage/widgets",
    connectEnsureLogin.ensureLoggedIn(),
    get__backstage_widgets
  );

  // SHOWS
  app.get(
    "/backstage/shows",
    connectEnsureLogin.ensureLoggedIn(),
    get__backstage_shows
  );

  app.post(
    "/backstage/shows/add",
    connectEnsureLogin.ensureLoggedIn(),
    post__backstage_shows_add
  );

  app.post(
    "/backstage/shows/edit",
    connectEnsureLogin.ensureLoggedIn(),
    post__backstage_shows_edit
  );

  // EVENTS
  app.get(
    "/backstage/events",
    connectEnsureLogin.ensureLoggedIn(),
    get__backstage_events
  );

  app.post(
    "/backstage/events/add",
    connectEnsureLogin.ensureLoggedIn(),
    post__backstage_events_add
  );

  app.post(
    "/backstage/events/edit",
    connectEnsureLogin.ensureLoggedIn(),
    post__backstage_events_edit
  );

  app.post(
    "/backstage/events/delete",
    connectEnsureLogin.ensureLoggedIn(),
    post__backstage_events_delete
  );

  // app.get("/admin/fanart", connectEnsureLogin.ensureLoggedIn(), fanart);
  // app.post(
  //   "/admin/fanart/approve",
  //   connectEnsureLogin.ensureLoggedIn(),
  //   post__fanartApprove
  // );

  app.get("/backstage/signup", get__backstage_signup);
  app.post("/backstage/signup", post__backstage_signup);
  app.get("/backstage/login", get__backstage_login);
  app.post(
    "/backstage/login",
    passport.authenticate("local"),
    post__backstage_login
  );
  app.get("/backstage/logout", get__backstage_logout);
};
