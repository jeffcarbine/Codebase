import { PRODUCTSUMMARY } from "./productSummary.html.js";

export const PRODUCTSUMMARYGRID = ({
  products,
  collectionHandle,
  count = 8,
  currency = "USD",
  convertPrice = [],
}) => {
  // render grid of placeholderes
  const generatePlaceholders = (count) => {
    const placeholders = [];
    for (let i = 0; i < count; i++) {
      placeholders.push(PRODUCTSUMMARY({ placeholder: true }));
    }

    return {
      class: "productSummaryGrid",
      "data-component": "product/productSummaryGrid",
      "data-collectionHandle": collectionHandle,
      "data-count": count,
      "data-currency": currency,
      "data-convertPrice": JSON.stringify(convertPrice),
      children: placeholders,
    };
  };

  // render grid of products
  const generateProducts = (products) => {
    const productSummaries = [];

    products.forEach((product) => {
      productSummaries.push(PRODUCTSUMMARY({ data: product, currency }));
    });

    return {
      class: "productSummaryGrid",
      children: productSummaries,
    };
  };

  // we render two different ways depending on whether or
  // not products have been passed in
  if (products) {
    return generateProducts(products);
  } else {
    return generatePlaceholders(count);
  }
};
