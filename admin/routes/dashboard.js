export const dashboard = (req, res, next) => {
  res.render("dashboard", {
    path: "/periodic/admin",
    subtitle: "Dashboard",
  });
};
