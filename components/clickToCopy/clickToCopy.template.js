import { BTN, ICON } from "../../elements/elements.js";

export const clickToCopyTemplate = (text) => {
  return {
    class: "clickToCopy",
    children: [
      {
        class: "text",
        child: {
          textContent: text,
        },
      },
      new BTN({
        class: "copy icon-only",
        child: new ICON("copy"),
        "data-text": text,
      }),
    ],
  };
};
