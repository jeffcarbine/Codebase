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
              src: item.variant.src,
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
              textContent: formatCurrency(item.variant.price.amount),
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

  // set the pricing
  const pricing_subtotal = formatCurrency(cartData.subtotalPrice.amount);
  let pricing_total = 0,
    pricing_discount = 0;

  // check for discounts
  const calculatedTotal = cartData.lineItemsSubtotalPrice.amount,
    total = cartData.subtotalPrice.amount;

  if (calculatedTotal !== total) {
    const diff = calculatedTotal - total;

    pricing_total = formatCurrency(calculatedTotal);
    pricing_discount = "Discount: -" + formatCurrency(diff);
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
