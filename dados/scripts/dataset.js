import { initModals } from "/periodic/components/modal/modal.js";
import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { xhrForm } from "/periodic/scripts/xhr/_xhr.js";

initModals();

const submitEditDatasets = (form) => {
  const formSuccess = (response) => {
    window.location.reload();
  };

  xhrForm({ form, formSuccess });
};

addEventDelegate("submit", "#addEditDataset", submitEditDatasets, true);
