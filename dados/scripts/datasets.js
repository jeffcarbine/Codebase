import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { createModal } from "/periodic/components/modal/modal.js";
import * as e from "/periodic/elements/elements.js";
import { toggleSwitchTemplate } from "/periodic/components/toggleswitch/toggleswitch.template.js";
import { card } from "/periodic/components/card/card.template.js";
import { xhr } from "/periodic/scripts/xhr/_xhr.js";
import { renderTemplate } from "/periodic/template/_renderTemplate.js";

const retrieveDatasets = () => {
  const generateDatasetsCards = (datasets) => {
    const datasetsTarget = document.querySelector("#datasets");
    datasetsTarget.classList.remove("loading");

    datasets.forEach((dataset) => {
      const datasetCard = renderTemplate(
        card({
          children: [
            new e.H2(dataset.name),
            new e.BTN({
              textContent: "Edit",
              href: "/admin/datasets/" + dataset._id,
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

const createAddDatasetsModal = (button) => {
  createModal(
    new e.FORM({
      method: "POST",
      action: "/admin/datasets/add",
      class: "style-inputs xhr",
      "data-redirect": "/admin/datasets",
      children: [
        new e.H2("New Dataset"),
        new e.TEXT("name"),
        toggleSwitchTemplate({
          name: "restricted",
          label: "Restrict to One Dataset",
        }),
        new e.LABEL({
          id: "restrictedTo",
          class: "hidden active",
          textContent: "Dataset Restricted To",
          child: new e.SELECT({
            name: "restrictedTo",
            children: ["text", "image", "event", "show"],
          }),
        }),
        new e.BTN({
          id: "createDataset",
          textContent: "Create Dataset",
        }),
      ],
    }),
    button
  );
};

addEventDelegate("click", "#addDataset", createAddDatasetsModal);

const showRestrictedTo = () => {
  const restrictedTo = document.querySelector("#restrictedTo");

  restrictedTo.classList.toggle("hidden");
};

addEventDelegate("input", "#restricted", showRestrictedTo);
