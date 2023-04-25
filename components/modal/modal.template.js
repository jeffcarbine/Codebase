import * as e from "../../elements/elements.js";

export const modalTemplate = (modalBody, id = "") => {
  return new e.DIALOG({
    class: "modal",
    id,
    children: [
      new e.BUTTON({
        class: "close",
        "aria-label": "Close Modal",
        children: [new e.ICON("close")],
      }),
      modalBody,
    ],
  });
};
