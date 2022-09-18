import loggedIn from "./logged-in.js";

export default (req, res, path, values = {}, status = 200) => {
  values.loggedIn = loggedIn(req);

  if (loggedIn(req)) {
    values.username = req.user.username;
    values.admin = req.user.admin;
  } else {
    values.username = null;
    values.admin = false;
  }

  const localhost = req.ip === "::ffff:127.0.0.1";
  values.localhost = localhost;

  res.status(status).render(path, values);
};
