import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { generateDatapointCards } from "../templates/datapointCard.template.js";

export const handleDatapointCards = (type, pageId = "") => {
  const fetchDatapoints = () => {
    const datapointsArea = document.querySelector("#datapoints");
    datapointsArea.innerHTML = "";
    datapointsArea.classList.add("loading");

    const success = (request) => {
      datapointsArea.classList.remove("loading");

      const datapoints = JSON.parse(request.response);

      const datapointCards = renderTemplate(
        generateDatapointCards(datapoints, pageId)
      );

      datapointsArea.appendChild(datapointCards);
    };

    xhr({
      path: "/periodic/admin/datapoints/retrieve",
      body: { type, pageId },
      success,
    });
  };

  fetchDatapoints();

  const removeDatapoint = (button) => {
    const _id = button.dataset.id,
      parentId = button.dataset.parentid,
      parentModel = button.dataset.parentmodel;

    const success = () => {
      // reload the datapoints
      fetchDatapoints();
    };

    xhr({
      path: "/periodic/admin/datapoints/remove",
      body: { _id, parentId, parentModel },
      success,
    });
  };

  addEventDelegate("click", ".removeDatapoint", removeDatapoint);
};

const saveAccordionOpenSate = (button) => {
  console.log("trying to save accordion state");
  setTimeout(() => {
    const id = button.dataset.id,
      accordionOpen = button.classList.contains("open");

    xhr({
      path: "/periodic/admin/datapoints",
      body: { id, accordionOpen },
    });
  }, 1000);
};

addEventDelegate(
  "click",
  ".card.edit .accordion-button",
  saveAccordionOpenSate
);
