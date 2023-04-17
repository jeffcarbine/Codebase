export const get__admin_login = (req, res) => {
  res.render("login", { subtitle: "dados Access" });
};

export const post__admin_login = (req, res) => {
  console.log("trying to post to dados login!");
  res.redirect("/dados");
};
