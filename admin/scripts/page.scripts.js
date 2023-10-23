import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";
import { handleDatapointCards } from "../modules/handleDatapointCards.js";

handleDatapointForm();
handleDatapointCards("page", pageId);

const editPage = (form) => {
  const success = (request) => {
    //window.location.reload();
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "#addEditPage", editPage, true);
