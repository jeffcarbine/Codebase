import { dashboard } from "./routes/dashboard.js";
import { events, addEvent, editEvent, deleteEvent } from "./routes/events.js";
import { fanart, post__fanartApprove } from "./routes/fanart.js";

export default (app, express, __dirname, connectEnsureLogin) => {
  app.use(
    "/admin/styles",
    express.static(__dirname + "/periodic/backstage/styles")
  );
  app.use(
    "/admin/scripts",
    express.static(__dirname + "/periodic/backstage/scripts")
  );
  app.use(
    "/admin/images",
    express.static(__dirname + "/periodic/backstage/images")
  );

  app.set("views", [
    __dirname + "/views",
    __dirname + "/periodic/backstage/views",
  ]);

  app.get("/admin", connectEnsureLogin.ensureLoggedIn(), dashboard);
  app.get("/admin/events", connectEnsureLogin.ensureLoggedIn(), events);
  app.post("/admin/events/add", connectEnsureLogin.ensureLoggedIn(), addEvent);
  app.post(
    "/admin/events/edit",
    connectEnsureLogin.ensureLoggedIn(),
    editEvent
  );
  app.post(
    "/admin/events/delete",
    connectEnsureLogin.ensureLoggedIn(),
    deleteEvent
  );
  app.get("/admin/fanart", connectEnsureLogin.ensureLoggedIn(), fanart);
  app.post(
    "/admin/fanart/approve",
    connectEnsureLogin.ensureLoggedIn(),
    post__fanartApprove
  );
};
