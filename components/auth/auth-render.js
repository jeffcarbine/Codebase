import loggedIn from "./logged-in.js";

export default (req, res, path, values = {}, status = 200) => {
  values.loggedIn = loggedIn(req);

  const localhost = req.ip === "::ffff:127.0.0.1";
  values.localhost = localhost;

  res.status(status).render(path, values);
};
