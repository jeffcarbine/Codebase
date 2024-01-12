import * as e from "../../elements/elements.js";
import * as c from "../components.js";

export const CARTTOGGLE = (target = "#cart") => {
  return new e.BUTTON({
    "data-component": "cartToggle",
    "data-target": target,
    id: "cartToggle",
    children: [
      new e.SPAN({
        class: "itemCount",
        child: new e.SPAN({
          class: "number",
          "data-emit": "cartCount",
        }),
      }),
      new c.ICON("cart"),
    ],
  });
};
