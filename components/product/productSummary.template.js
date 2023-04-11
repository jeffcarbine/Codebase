import * as e from "../../elements/elements.js";
import { squareTemplate } from "../square/square.template.js";
import { formatCurrency } from "../../scripts/formatCurrency/formatCurrency.js";

export const productSummaryTemplate = ({
  data = {
    images: [
      {
        src: "",
      },
    ],
    variants: [
      {
        compareAtPrice: {},
        price: {},
      },
    ],
  },
  placeholder = false,
} = {}) => {
  return {
    tagName: placeholder ? "div" : "a",
    href: "/shop/product/" + data.handle || "",
    class: "productSummary" + (placeholder ? " placeholder" : ""),
    children: [
      {
        class: "image",
        children: [
          squareTemplate,
          new e.IMG({
            if: !placeholder,
            src: data.images[0].src || "",
          }),
          {
            if: placeholder,
            class: "placeholderImage",
          },
        ],
      },
      {
        class: "title",
        children: [
          new e.H3({
            if: !placeholder,
            textContent: data.title || "",
          }),
          {
            if: placeholder,
            class: "placeholderTitle",
          },
        ],
      },
      {
        class: "pricing",
        children: [
          {
            if:
              !placeholder &&
              data.variants[0].compareAtPrice.amount !==
                data.variants[0].price.amount,
            class: "compareAt",
            textContent: formatCurrency(
              data.variants[0].compareAtPrice.amount || ""
            ),
          },
          {
            if: !placeholder,
            class: "price",
            textContent: formatCurrency(data.variants[0].price.amount || ""),
          },
          {
            if: placeholder,
            class: "placeholderPrice",
          },
        ],
      },
    ],
  };
};
