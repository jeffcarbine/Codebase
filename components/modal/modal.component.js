import { DIALOG, BUTTON } from "../../elements/elements.js";
import { ICON } from "../icon/icon.component.js";

export const MODAL = ({ modalBody = {}, id = "", className = "" } = {}) => {
  return new DIALOG({
    class: "modal " + className,
    id,
    children: [
      new BUTTON({
        class: "close",
        "aria-label": "Close Modal",
        children: [new ICON("close")],
      }),
      modalBody,
    ],
  });
};
