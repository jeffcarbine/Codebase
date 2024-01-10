import * as e from "../../elements/elements.js";
import { PRODUCTSUMMARY } from "../product/productSummary.html.js";
import { PRODUCTSUMMARYGRID } from "../product/productSummaryGrid.html.js";

export const COLLECTION = (data, count = 8) => {
  const collection = data.collection;

  return {
    id: "collection",
    "data-component": "collection",
    children: [
      new e.SECTION({
        class: "collection-title",
        children: [new e.H1(data.title), new e.P(collection.description)],
      }),
      new e.SECTION({
        child: new e.ARTICLE({
          class: "collection",
          child: PRODUCTSUMMARYGRID({ products: collection.products }),
        }),
      }),
    ],
  };
};
