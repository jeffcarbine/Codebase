import { DIALOG, BUTTON } from "../../elements/elements.js";
import { ICON } from "../icon/icon.html.js";

export const MODAL = ({ modalBody = {}, id = "", className = "" } = {}) => {
  return new DIALOG({
    "data-component": "modal",
    class: "modal " + className,
    id,
    child: {
      class: "modal-content",
      children: [
        new BUTTON({
          class: "close",
          "aria-label": "Close Modal",
          children: [new ICON("close")],
        }),
        modalBody,
      ],
    },
  });
};
