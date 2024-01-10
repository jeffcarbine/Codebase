import { IMG, H3 } from "../../elements/elements.js";
import { SQUARE } from "../square/square.html.js";
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";
import { camelize } from "../../modules/formatString/formatString.js";

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
  url = "/shop/product/",
} = {}) => {
  const price = data.variants[0].price.amount,
    hasCompareAtPrice = data.variants[0].compareAtPrice !== null,
    compareAtPrice = hasCompareAtPrice
      ? data.variants[0].compareAtPrice.amount
      : price;

  let tags = "",
    nsfw = false;

  // loop through the tags and add the values to the tags string
  if (data.tags) {
    data.tags.forEach((tag) => {
      tags += `${camelize(tag.value)} `;

      if (tag.value === "nsfw") {
        nsfw = true;
      }
    });
  }

  return {
    tagName: placeholder ? "div" : "a",
    href: url + data.handle || "",
    class: `productSummary ${tags} ${placeholder ? "placeholder" : ""}`,
    target: url === "/shop/product/" ? "" : "_blank",
    "data-nsfw-event": nsfw ? "click" : "none",
    children: [
      {
        class: "image",
        "data-nsfw": nsfw,
        children: [
          SQUARE,
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
        if: data.availableForSale,
        class: "pricing",
        children: [
          {
            if: !placeholder && hasCompareAtPrice && compareAtPrice !== price,
            class: "compareAt",
            textContent: formatCurrency(compareAtPrice),
          },
          {
            if: !placeholder,
            class: "price " + (compareAtPrice !== price ? "onSale" : ""),
            textContent: formatCurrency(data.variants[0].price.amount || ""),
          },
          {
            if: placeholder,
            class: "placeholderPrice",
          },
        ],
      },
      {
        if: !data.availableForSale,
        class: "pricing",
        child: {
          if: !placeholder,
          class: "soldOut",
          textContent: "Sold Out",
        },
      },
    ],
  };
};
