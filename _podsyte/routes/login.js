import { rez } from "../modules/rez.js";
import User from "../models/User.js";

export const get__admin_login = (req, res) => {
  // check to see if there are any users
  User.find().exec((err, users) => {
    if (err) {
    } else {
      if (users.length > 0) {
        rez({
          req,
          res,
          template: "login",
          data: { subtitle: "Podsyte Access" },
        });
      } else {
        rez({
          req,
          res,
          template: "signup",
          data: { subtitle: "Podsyte Access" },
        });
      }
    }
  });
};

export const post__admin_login = (req, res) => {
  res.redirect("/admin");
};
