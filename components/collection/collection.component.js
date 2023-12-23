import * as e from "../../elements/elements.js";
import { PRODUCTSUMMARY } from "../product/productSummary.component.js";

export const COLLECTION = (data) => {
  const collection = data.collection;

  return {
    id: "collection",
    "data-component": "collection",
    children: [
      new e.SECTION({
        children: [new e.H1(data.title), new e.P(collection.description)],
      }),
      new e.SECTION({
        child: new e.ARTICLE({
          class: "collection",
          child: {
            class: "productSummaryGrid",
            id: collection.title,
            children: [
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
              PRODUCTSUMMARY({ placeholder: true }),
            ],
          },
        }),
      }),
    ],
  };
};
