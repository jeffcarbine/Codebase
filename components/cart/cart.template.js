import * as e from "../../elements/elements.js";

const cart = ({ title = "Cart" } = {}) => {
  return {
    id: "cart",
    child: {
      class: "inner-cart",
      children: [
        {
          class: "cart-header",
          child: new e.H2(title),
        },
        {
          class: "line-items",
        },
        {
          class: "cart-footer",
          children: [
            {
              class: "pricing",
            },
            {
              class: "",
            },
          ],
        },
      ],
    },
  };
};
