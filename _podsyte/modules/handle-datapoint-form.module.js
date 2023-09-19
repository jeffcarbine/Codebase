import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhrForm } from "/periodic/modules/xhr/xhr.js";

export const handleDatapointForm = () => {
  const submitDatapointForm = (form) => {
    const success = () => {
      window.location.reload();
    };

    xhrForm({ form, success });
  };

  addEventDelegate(
    "submit",
    ".addEditDatapoint form",
    submitDatapointForm,
    true
  );
};
