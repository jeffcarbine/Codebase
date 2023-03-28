export const dashboard = (req, res, next) => {
  res.render("dashboard", {
    path: "/backstage",
    subtitle: "Dashboard",
  });
};
