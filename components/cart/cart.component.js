import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import * as i from "../../components/icon/icons.js";
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";

export const CART = () => {
  return {
    id: "cart",
    children: [
      new e.BUTTON({
        id: "cartClose",
        child: new c.ICON("close"),
      }),
      {
        class: "heading",
        child: new e.H2("Cart"),
      },
      {
        id: "cartBody",
      },
    ],
  };
};

export const cartBodyTemplate = (cartData) => {
  const lineItemsData = cartData.lineItems,
    checkout = cartData.webUrl,
    lineItems = [],
    pricing = [];

  // set default zero for itemCount
  let itemCount = 0;

  // loop through the lineItems
  lineItemsData.forEach((item) => {
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
              textContent: item.title,
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
                    new e.BUTTON({
                      class: "modifyQuantity",
                      "data-quantity": item.quantity - 1,
                      "data-item-id": item.id,
                      children: [
                        new e.ICON({
                          icon: i.minusSmall,
                        }),
                      ],
                    }),
                    new e.SPAN({
                      class: "lineItemQuantity",
                      textContent: item.quantity,
                    }),
                    new e.BUTTON({
                      class: "modifyQuantity",
                      "data-quantity": item.quantity + 1,
                      "data-item-id": item.id,
                      children: [
                        new e.ICON({
                          icon: i.plusSmall,
                        }),
                      ],
                    }),
                  ],
                },
                new e.BUTTON({
                  class: "modifyQuantity delete",
                  "aria-label": "Remove " + item.title,
                  "data-quantity": 0,
                  "data-item-id": item.id,
                  children: [
                    new e.ICON({
                      icon: i.trash,
                    }),
                  ],
                }),
              ],
            },
          ],
        },
        new e.SPAN({
          class: "price",
          textContent: formatCurrency(item.variant.price.amount),
        }),
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
    class: "cartData",
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
          new e.P({
            class: "taxesAndShipping",
            textContent: "Taxes and shipping are calculated at checkout",
          }),
          new c.BTN({ href: checkout, textContent: "Check Out" }),
        ],
      },
    ],
  };
};
