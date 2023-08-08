import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { CARD } from "/periodic/components/card/card.component.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";

const retrieveDatasets = () => {
  const datasetsTarget = document.querySelector("#datasets");
  datasetsTarget.classList.add("loading");

  const generateDatasetsCards = (datasets) => {
    datasetsTarget.classList.remove("loading");
    datasetsTarget.innerHTML = "";

    datasets.forEach((dataset) => {
      const datasetCard = renderTemplate(
        CARD({
          children: [
            new e.H2(dataset.name),
            new c.BTN({
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
