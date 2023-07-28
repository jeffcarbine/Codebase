import { rez } from "../modules/rez.js";

export default (req, res, next) => {
  return rez({ req, res, template: "error", data: { path: "/error" } });
};
