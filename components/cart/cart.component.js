import { H2 } from "../../elements/headings/headings.element.js";

export const CART = ({ title = "Cart" } = {}) => {
  return {
    id: "cart",
    child: {
      class: "inner-cart",
      children: [
        {
          class: "cart-header",
          child: new H2(title),
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
