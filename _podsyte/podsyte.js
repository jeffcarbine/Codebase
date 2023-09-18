import User from "./models/User.js";

import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import { generateAdminRoutes } from "./modules/generateAdminRoutes.js";
import { generateRoutes } from "./modules/generateRoutes.js";

export const init = ({
  app,
  express,
  __dirname,
  database,
  events = false,
  fanart = false,
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
    express.static(__dirname + "/periodic/_podsyte/styles")
  );

  app.use(
    "/admin/scripts",
    express.static(__dirname + "/periodic/_podsyte/scripts")
  );

  app.use(
    "/admin/modules",
    express.static(__dirname + "/periodic/_podsyte/modules")
  );

  app.use(
    "/admin/templates",
    express.static(__dirname + "/periodic/_podsyte/templates")
  );

  app.use(
    "/admin/images",
    express.static(__dirname + "/periodic/_podsyte/images")
  );

  app.set("views", [
    __dirname + "/views",
    __dirname + "/periodic/_podsyte/views",
  ]);

  // GENERATE ADMIN ROUTES
  generateAdminRoutes(app, __dirname, { events, fanart });

  // GENERATE USER ROUTES
  generateRoutes(app);
};
