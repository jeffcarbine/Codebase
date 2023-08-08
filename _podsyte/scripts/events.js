import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhrForm } from "/periodic/modules/xhr/xhr.js";

const addEditEvent = (form) => {
  const success = () => {
    window.location.reload();
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", ".addEditEvent", addEditEvent, true);
