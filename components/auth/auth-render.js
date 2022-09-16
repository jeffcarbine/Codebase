import loggedIn from "./logged-in.js";

export default (req, res, path, values = {}, status = 200) => {
  values.loggedIn = loggedIn(req);

  res.status(status).render(path, values);
};
