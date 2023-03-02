import * as e from "../../template/elements.js";

export const _modal = (modalBody) => {
  return new e.DIALOG({
    class: "modal",
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
