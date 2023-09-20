import { BUTTON } from "../../elements/button/button.element.js";
import { ICON } from "../icon/icon.component.js";

export const SHARE = ({ title, url, className = "" } = {}) => {
  return new BUTTON({
    "data-component": "share",
    child: new ICON("share"),
    class: "share " + className,
    "data-title": title,
    "data-url": url,
  });
};
