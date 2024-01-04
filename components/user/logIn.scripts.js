import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhrForm } from "../../modules/xhr/xhr.js";

const logIn = (form) => {
  const success = (request) => {
    const redirect = request.response;

    window.location = redirect;
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "form#logInForm", logIn, true);
