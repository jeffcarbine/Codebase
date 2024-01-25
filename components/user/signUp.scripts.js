import { dataEmit } from "../../modules/dataEmit/dataEmit.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { passwordRegex } from "./passwordRegex.js";
import { xhrForm } from "../../modules/xhr/xhr.js";

export const validatePassword = () => {
  const checkPasswordComplexity = (input) => {
    if (input.value !== "") {
      if (passwordRegex.test(input.value)) {
        dataEmit("password--validation", "");
      } else {
        dataEmit(
          "password--validation",
          "Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character"
        );
      }
    } else {
      dataEmit("password--validation", "");
    }
  };

  addEventDelegate(
    "focusout",
    "input[name='password']",
    checkPasswordComplexity
  );

  const checkPasswordMatch = (input) => {
    const passwordInput =
        input.name === "password"
          ? input
          : document.querySelector("input[name='password']"),
      passwordConfirmInput =
        input.name === "passwordConfirm"
          ? input
          : document.querySelector("input[name='passwordConfirm']");

    if (
      passwordConfirmInput.value != "" &&
      passwordInput.value !== passwordConfirmInput.value
    ) {
      dataEmit("passwordConfirm--validation", "Passwords do not match");
    } else {
      dataEmit("passwordConfirm--validation", "");
    }
  };

  addEventDelegate(
    "keyup",
    "input[name='passwordConfirm'], input[name='password']",
    checkPasswordMatch
  );
};

validatePassword();

const signUp = (form) => {
  const success = (request) => {
    const redirect = request.response;

    window.location = "/login";
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "form#signUpForm", signUp, true);
