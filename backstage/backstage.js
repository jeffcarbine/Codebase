import { dashboard } from "./routes/dashboard.js";
import { get__backstage_login, post__backstage_login } from "./routes/login.js";
import { get__backstage_logout } from "./routes/logout.js";
import {
  get__backstage_signup,
  post__backstage_signup,
} from "./routes/signup.js";
// import { events, addEvent, editEvent, deleteEvent } from "./routes/events.js";
// import { fanart, post__fanartApprove } from "./routes/fanart.js";

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
  // app.get("/admin/events", connectEnsureLogin.ensureLoggedIn(), events);
  // app.post("/admin/events/add", connectEnsureLogin.ensureLoggedIn(), addEvent);
  // app.post(
  //   "/admin/events/edit",
  //   connectEnsureLogin.ensureLoggedIn(),
  //   editEvent
  // );
  // app.post(
  //   "/admin/events/delete",
  //   connectEnsureLogin.ensureLoggedIn(),
  //   deleteEvent
  // );
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
