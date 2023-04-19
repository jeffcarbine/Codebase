import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import * as e from "/periodic/elements/elements.js";
import { card } from "/periodic/components/card/card.template.js";
import { xhr, xhrForm } from "/periodic/scripts/xhr/_xhr.js";
import { renderTemplate } from "/periodic/template/_renderTemplate.js";

const retrieveDatasets = () => {
  const generateDatasetsCards = (datasets) => {
    const datasetsTarget = document.querySelector("#datasets");

    datasetsTarget.classList.remove("loading");
    datasetsTarget.innerHTML = "";

    datasets.forEach((dataset) => {
      const datasetCard = renderTemplate(
        card({
          children: [
            new e.H2(dataset.name),
            new e.BTN({
              textContent: "Edit",
              href: "/admin/datasets/dataset/" + dataset._id,
            }),
          ],
        })
      );

      datasetsTarget.appendChild(datasetCard);
    });
  };

  const success = (request) => {
    const response = JSON.parse(request.response);

    generateDatasetsCards(response);
  };

  xhr({ path: "/admin/datasets/retrieve", callbacks: { success } });
};

retrieveDatasets();

const submitAddDatasets = (form) => {
  const modal = form.parentNode;

  const formSuccess = (response) => {
    const dataset = JSON.parse(response);

    window.location = "/admin/datasets/dataset/" + dataset._id;
  };

  xhrForm({ form, formSuccess });
};

addEventDelegate("submit", "#addEditDataset", submitAddDatasets, true);
