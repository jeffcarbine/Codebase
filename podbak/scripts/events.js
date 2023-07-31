import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { xhrForm } from "/periodic/scripts/xhr/xhr.js";

const addEditEvent = (form) => {
  const success = () => {
    window.location.reload();
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", ".addEditEvent", addEditEvent, true);
