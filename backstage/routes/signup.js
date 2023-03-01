import User from "../models/1user.js";
import passport from "passport";
import authRender from "./auth-render.js";
import emailValidator from "email-validator";

export const get__backstage_signup = (req, res) => {
  authRender(req, res, "signup", { subtitle: "Sign Up for Backstage Access" });
};

export const post__backstage_signup = (req, res) => {
  // get the usernane and password from the request
  const username = req.body.email,
    password = req.body.password,
    passwordConfirm = req.body.passwordConfirm;

  // first, check to see if the passwords match
  if (password !== passwordConfirm) {
    return res.status(500).send("Passwords do not match");
  }

  // and then check if the email is valid
  if (!emailValidator.validate(username)) {
    return res.status(500).send("Not a valid email address.");
  }

  User.register(
    new User({ username, admin: false }),
    password,
    (err, account) => {
      if (err) {
        return res.render("signup", { account: account });
      }

      passport.authenticate("local")(req, res, () => {
        res.redirect("/backstage");
      });
    }
  );
};
