import { IMG, H3, SPAN } from "../../elements/elements.js";
import { ICON } from "../../components/components.js";
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
    compareAtPrice = data.variants[0].compareAtPrice?.amount || price,
    currency = data.variants[0].price.currencyCode,
    price__converted = data.variants[0].price__converted?.amount,
    compareAtPrice__converted =
      data.variants[0].compareAtPrice__converted?.amount,
    currency__converted = data.variants[0].price__converted?.currencyCode;

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
          new ICON("square"),
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
            if: !placeholder && compareAtPrice !== price,
            class: "compareAt",
            textContent: formatCurrency(
              compareAtPrice__converted || compareAtPrice,
              currency__converted || currency
            ),
          },
          // {
          //   if:
          //     !placeholder &&
          //     compareAtPrice !== price &&
          //     compareAtPrice__converted !== undefined,
          //   class: "original",
          //   textContent: `(${formatCurrency(compareAtPrice, currency)})`,
          // },
          {
            if: !placeholder,
            class: "price " + (compareAtPrice !== price ? "onSale" : ""),
            children: [
              formatCurrency(
                price__converted || price,
                currency__converted || currency
              ),
              {
                if: price__converted !== undefined,
                class: "currencyCode",
                child: new SPAN({
                  class: "tag accent sm",
                  textContent: currency__converted,
                }),
              },
            ],
          },
          {
            if: !placeholder && price__converted !== undefined,
            class: "original",
            textContent: `(${formatCurrency(price, currency)})`,
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
