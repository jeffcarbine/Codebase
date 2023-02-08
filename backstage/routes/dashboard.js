export const dashboard = (req, res, next) => {
  res.render("dashboard", {
    path: "/admin",
    subtitle: "Dashboard",
  });
};
