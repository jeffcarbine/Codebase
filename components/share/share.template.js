import * as e from "../../elements/elements.js";

export const shareTemplate = ({ title, url, className = "" } = {}) => {
  return new e.BUTTON({
    child: new e.ICON("share"),
    class: "share " + className,
    "data-title": title,
    "data-url": url,
  });
};
