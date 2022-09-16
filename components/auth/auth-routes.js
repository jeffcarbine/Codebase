import User from "../../models/user.js";
import passport from "passport";
import authRender from "./auth-render.js";

export const login = (req, res) => {
  authRender(req, res, "login");
};

export const signup = (req, res) => {
  res.render("signup", {
    subtitle: "Sign Up",
  });
};

export const register = (req, res) => {
  console.log("registering!");
  // get the usernane and password from the request
  const username = req.body.username,
    password = req.body.password,
    passwordConfirm = req.body.passwordConfirm;

  // first, check to see if the passwords match
  if (password !== passwordConfirm) {
    return res.status(500).send("Passwords do not match");
  }

  User.register(
    new User({ username, admin: false }),
    password,
    (err, account) => {
      if (err) {
        return res.render("signup", { account: account });
      }

      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  );
};

export const authenticate = (req, res) => {
  console.log("made it here!");
  res.redirect("/");
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
