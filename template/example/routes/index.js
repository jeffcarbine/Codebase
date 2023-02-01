import { index_template } from "../views/index.template.js";

export const index = (req, res) => {
  res.render(
    index_template({
      heading: "Hello World",
      paragraph: "The inevitable robot apocalypse",
    })
  );
};
