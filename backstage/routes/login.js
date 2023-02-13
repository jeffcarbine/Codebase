import authRender from "./auth-render.js";

export const get__backstage_login = (req, res) => {
  authRender(req, res, "login", { subtitle: "Backstage Access" });
};

export const post__backstage_login = (req, res) => {
  console.log("trying to post to backstage login!");
  res.redirect("/backstage");
};
