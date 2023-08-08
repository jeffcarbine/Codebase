import { initModals } from "/periodic/components/modal/modal.js";
import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { datapointCardTemplate } from "/periodic/_podsyte/templates/datapointCard.template.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";

initModals();
handleDatapointForm();

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
