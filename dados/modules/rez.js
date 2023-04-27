export const rez = ({ req, res, template, data = {} } = {}) => {
  // check if we are logged in or not
  if (req.user) {
    data.loggedIn = true;
  } else {
    data.loggedIn = false;
  }

  // gives the route to the data
  data.path = req.route.path;

  // fetch all datapoints associated to this route

  // fetch all global datapoints

  res.render(template, data);
};
