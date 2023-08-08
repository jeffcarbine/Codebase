import { IMG, H3 } from "../../elements/elements.js";
import { squareTemplate } from "../square/square.component.js";
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";

export const PRODUCTSUMMARY = ({
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
  const price = data.variants[0].price.value,
    hasCompareAtPrice = data.variants[0].compareAtPrice !== null,
    compareAtPrice = hasCompareAtPrice
      ? data.variants[0].compareAtPrice.value
      : price;

  return {
    tagName: placeholder ? "div" : "a",
    href: "/shop/product/" + data.handle || "",
    class: "productSummary" + (placeholder ? " placeholder" : ""),
    children: [
      {
        class: "image",
        children: [
          squareTemplate,
          new IMG({
            if: !placeholder,
            src: data.images[0].src || "",
            alt: data.title,
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
          new H3({
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
            if: !placeholder && hasCompareAtPrice && compareAtPrice !== price,
            class: "compareAt",
            textContent: formatCurrency(compareAtPrice),
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
