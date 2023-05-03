import { rez } from "../modules/rez.js";

export const get__admin_login = (req, res) => {
  rez({ req, res, template: "login", data: { subtitle: "Dados Access" } });
};

export const post__admin_login = (req, res) => {
  console.log("trying to post to dados login!");
  res.redirect("/admin");
};
