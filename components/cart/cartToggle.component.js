import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export const CARTTOGGLE = () => {
  return new e.BUTTON({
    id: "cartToggle",
    children: [
      new e.SPAN({
        class: "itemCount",
        child: new e.SPAN({
          class: "number",
          "data-bind": "cartCount",
        }),
      }),
      new c.ICON("cart"),
    ],
  });
};
