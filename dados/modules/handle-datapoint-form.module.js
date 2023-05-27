import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { xhrForm } from "/periodic/scripts/xhr/xhr.js";

export const handleDatapointForm = () => {
  console.log("handling datapoint form");
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
