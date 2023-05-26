import { initModals } from "/periodic/components/modal/modal.js";
import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "/periodic/scripts/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { datapointCardTemplate } from "/periodic/dados/templates/datapointCard.template.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";

initModals();
handleDatapointForm();

const submitEditDatasets = (form) => {
  const formSuccess = (response) => {
    window.location.reload();
  };

  xhrForm({ form, formSuccess });
};

addEventDelegate("submit", "#addEditDataset", submitEditDatasets, true);

const submitAddDatapoint = (form) => {
  const modal = form.closest("dialog");

  const success = (response) => {
    modal.close();
    const datapointIds = JSON.parse(response);

    fetchDatapoints(datapointIds);
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", ".datapointForm", submitAddDatapoint, true);

const submitEditDatapoint = (form) => {
  const modal = form.closest("dialog");

  const success = (response) => {
    modal.close();
    const datapointIds = JSON.parse(response);

    fetchDatapoints(datapointIds);
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", ".editDatapoint", submitEditDatapoint, true);
