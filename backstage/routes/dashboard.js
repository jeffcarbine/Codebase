import { get_admin_route } from "../../../modules/get_route.js";
import User from "../../models/user.js";

export const dashboard = (req, res, next) => {
  get_admin_route(req, res, next, (mainCallback) => {
    // get data for the dashbaord

    User.find({}).exec((err, users) => {
      const count = users.length;

      mainCallback("dashboard", { path: "/admin", subtitle: "Dashboard" });
    });
  });
};
