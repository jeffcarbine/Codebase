import { DIALOG, BUTTON } from "../../elements/elements.js";

export const MODAL = ({ modalBody = {}, id = "", className = "" } = {}) => {
  return new DIALOG({
    class: "modal " + className,
    id,
    children: [
      new BUTTON({
        class: "close",
        "aria-label": "Close Modal",
        children: [new e.ICON("close")],
      }),
      modalBody,
    ],
  });
};
