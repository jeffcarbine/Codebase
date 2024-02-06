import { getCountry } from "../../modules/getCountry/getCountry.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { PRODUCTSUMMARY } from "./productSummary.html.js";

const productSummaryGrids = document.querySelectorAll(".productSummaryGrid");

productSummaryGrids.forEach((productSummaryGrid) => {
  const collectionHandle = productSummaryGrid.dataset.collectionhandle,
    count = productSummaryGrid.dataset.count,
    url = productSummaryGrid.dataset.url;

  const success = (request) => {
    const products = JSON.parse(request.response).products;

    // clear out the placeholders
    productSummaryGrid.innerHTML = "";
    products.forEach((product) => {
      const productSummary = renderTemplate(
        PRODUCTSUMMARY({
          data: product,
          url,
        })
      );
      productSummaryGrid.appendChild(productSummary);
    });
  };

  xhr({
    path: "/shop/collection",
    body: { collectionHandle, count },
    success,
  });
});
