export default (req, res, next) => {
  res.render("error", { path: "404" });
};
