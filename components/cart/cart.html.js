import * as e from "../../elements/elements.js";
import * as c from "../components.js";
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";

export const CART = () => {
  return {
    "data-component": "cart",
    id: "cart",
    children: [
      {
        id: "cartBody",
        children: [
          new e.BUTTON({
            id: "cartClose",
            child: new c.ICON("close"),
          }),
          {
            id: "cartHeader",
            child: new e.H2("Cart"),
          },
          {
            id: "cartContent",
          },
        ],
      },
    ],
  };
};

const generateItemTitle = (item) => {
  return `${item.title} (${item.variant.title})`;
};

export const cartContentTemplate = (cartData) => {
  const lineItemsData = cartData.lineItems,
    checkout = cartData.webUrl,
    lineItems = [],
    pricing = [];

  // set default zero for itemCount
  let itemCount = 0;

  // loop through the lineItems
  lineItemsData.forEach((item) => {
    console.log(item);

    const lineItem = new e.LI({
      class: "lineItem",
      children: [
        {
          class: "image",
          children: [
            new e.IMG({
              src: item.variant.image.src,
            }),
          ],
        },
        new e.SPAN({
          class: "title",
          children: [
            new e.SPAN({
              textContent: generateItemTitle(item),
            }),
            new e.SPAN({
              class: "price",
              textContent: formatCurrency(
                item.variant.price__converted?.amount ||
                  item.variant.price.amount,
                item.variant.price__converted?.currencyCode ||
                  item.variant.price.currencyCode
              ),
            }),
          ],
        }),
        {
          class: "quantity",
          children: [
            {
              class: "center",
              children: [
                {
                  class: "quantityContainer",
                  children: [
                    new c.FIELD({
                      className: "lineItemQuantity",
                      "aria-label": "Quantity",
                      value: item.quantity,
                      "data-item-id": item.id,
                    }),
                  ],
                },
                new e.BUTTON({
                  class: "deleteLineItem",
                  "aria-label": "Remove " + item.title,
                  "data-quantity": 0,
                  "data-item-id": item.id,
                  children: [new c.ICON("trash")],
                }),
              ],
            },
          ],
        },
      ],
    });

    lineItems.push(lineItem);

    // and add the quantity to the itemCount
    itemCount += item.quantity;
  });

  // get the cart subtotal values
  const subtotal =
      cartData.subtotalPrice__converted?.amount ||
      cartData.subtotalPrice.amount,
    lineItemsSubtotal =
      cartData.lineItemsSubtotalPrice__converted?.amount ||
      cartData.lineItemsSubtotalPrice.amount,
    currencyCode =
      cartData.subtotalPrice__converted?.currencyCode ||
      cartData.subtotalPrice.currencyCode;

  // set the pricing
  const pricing_subtotal = formatCurrency(subtotal, currencyCode);

  let pricing_total = 0,
    pricing_discount = 0;

  // check for discounts
  if (lineItemsSubtotal !== subtotal) {
    const diff = lineItemsSubtotal - subtotal;

    pricing_total = formatCurrency(lineItemsSubtotal, currencyCode);
    pricing_discount = "Discount: -" + formatCurrency(diff, currencyCode);
  }

  return {
    id: "content",
    children: [
      {
        id: "lineItems",
        children: lineItems,
      },
      {
        id: "pricing",
        children: [
          {
            class: "total",
            if: pricing_total > 0,
            textContent: pricing_total,
          },
          {
            class: "discount",
            if: pricing_discount > 0,
            textContent: pricing_discount,
          },
          {
            class: "subtotal",
            textContent: pricing_subtotal,
          },
        ],
      },
      {
        id: "checkout",
        children: [
          new c.BTN({ href: checkout, textContent: "Check Out" }),
          new e.P({
            class: "taxesAndShipping",
            textContent: "(Taxes and shipping are calculated at checkout)",
          }),
        ],
      },
    ],
  };
};
