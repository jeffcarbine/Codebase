import User from "../../premmio/models/User.js";
import passport from "passport";
import emailValidator from "email-validator";
import { passwordRegex } from "../components/user/passwordRegex.js";

export const enableUserRoutes = (app, redirect = "/") => {
  const post__user_signUp = (req, res) => {
    // get the usernane and password from the request
    const username = req.body.email,
      password = req.body.password,
      passwordConfirm = req.body.passwordConfirm,
      firstName = req.body.firstName,
      lastName = req.body.lastName,
      pledge = req.body.pledge;

    let valid = true,
      validationMessage = "";

    // first, check to see if the passwords match
    if (password !== passwordConfirm) {
      valid = false;
      validationMessage += "Passwords do not match.";
    }

    if (!passwordRegex.test(password)) {
      valid = false;
      validationMessage +=
        "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    // and then check if the email is valid
    if (!emailValidator.validate(username)) {
      valid = false;
      validationMessage += "Email address is not valid.";
    }

    if (!valid) {
      return res.status(500).send(validationMessage);
    } else {
      User.register(
        new User({ username, firstName, lastName, pledge }),
        password,
        (err, account) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err.message);
          }

          return res.status(200).send();
        }
      );
    }
  };

  const post__user_login = (req, res) => {
    // redirect to /premmio if the user clearance is <= 3
    const user = req.user;

    let redirectPath = "/";

    if (user.clearance <= 3) {
      redirectPath = "/premmio";
    }

    res.status(200).send(redirectPath);
  };

  app.post("/user/signUp", post__user_signUp);
  app.post("/user/logIn", passport.authenticate("local"), post__user_login);
};
