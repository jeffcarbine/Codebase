import { BUTTON } from "../../elements/button/button.html.js";
import { ICON } from "../icon/icon.html.js";

export const SHARE = ({ title, url, className = "" } = {}) => {
  return new BUTTON({
    "data-component": "share",
    child: new ICON("share"),
    class: "share " + className,
    "data-title": title,
    "data-url": url,
  });
};
