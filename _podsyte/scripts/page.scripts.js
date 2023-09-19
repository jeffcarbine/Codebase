import { initModals } from "/periodic/components/modal/modal.js";
import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";
import { generateDatapointCards } from "../templates/datapointCard.template.js";

initModals();
handleDatapointForm();

const fetchDatapoints = () => {
  const success = (request) => {
    const datapoints = JSON.parse(request.response);

    console.log(datapoints);

    const datapointsArea = document.querySelector("#datapoints"),
      datapointCards = renderTemplate(
        generateDatapointCards(datapoints, parentId)
      );

    datapointsArea.appendChild(datapointCards);
  };

  xhr({ path: "/admin/pages/getDatapoints", body: { pageId }, success });
};

fetchDatapoints();

const removeDatapoint = (button) => {
  const _id = button.dataset.id,
    parentId = button.dataset.parentid,
    parentModel = button.dataset.parentmodel;

  const success = () => {
    // refresh the page
    window.location.reload();
  };

  xhr({
    path: "/admin/datapoints/remove",
    body: { _id, parentId, parentModel },
    success,
  });
};

addEventDelegate("click", ".removeDatapoint", removeDatapoint);

const saveAccordionOpenSate = (button) => {
  setTimeout(() => {
    const id = button.dataset.id,
      accordionOpen = button.classList.contains("open");

    xhr({ path: "/admin/pages/getDatapoints", body: { id, accordionOpen } });
  }, 500);
};

addEventDelegate("click", ".accordion-button", saveAccordionOpenSate);
