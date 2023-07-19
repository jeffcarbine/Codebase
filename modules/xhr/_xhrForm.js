import { addEventDelegate } from "../eventDelegate/eventDelegate.js";
import { xhr } from "./xhr.js";
import { toast } from "../../components/alert/_alert.js";

const xhrForm = (form) => {
  // get the data from the form
  const formData = new FormData(form),
    method = form.method,
    action = form.action,
    json = {};

  // add the loading class to the form
  if (!form.classList.contains("loading")) {
    form.classList.add("loading");
  }

  formData.forEach((value, key) => {
    // need to create subobjects
    if (key.includes(".")) {
      // then split it and assign it as split
      let parent = key.split(".")[0],
        child = key.split(".")[1];

      // and if the parent is undefined, define it
      if (json[parent] === undefined) {
        json[parent] = {};
      }

      json[parent][child] = value;
    } else {
      json[key] = value;
    }
  });

  const renderResponse = (string, status) => {
    form.classList.remove("loading");

    toast(string, { status }, form);
  };

  // default behaviours for success, error and failure
  const success = (request) => {
    const redirect = form.dataset.redirect !== undefined;

    if (redirect) {
      window.location = form.dataset.redirect;
    } else {
      renderResponse(request.response, "success");
      form.reset();
    }
  };

  const error = function (request) {
    let message = request.response;

    if (request.status === 400) {
      if (form.dataset.http400 !== undefined) {
        message = form.dataset.http400;
      }
    }

    if (request.status === 401) {
      if (form.dataset.http401 !== undefined) {
        message = form.dataset.http401;
      }
    }

    renderResponse(message, "error");
  };

  const failure = (request) => {
    renderResponse(request.response, "failure");
  };

  // const progress = (event) => {
  //   console.log(progress);
  // };

  // and now pass this all to the xhr function
  setTimeout(() => {
    xhr({
      method: method,
      path: action,
      body: json,
      callbacks: { success, error, failure },
    });
  }, 1000);
};

// run xhrForm on any form with a class of xhr
addEventDelegate("submit", "form.xhr", xhrForm, true);

const xhrFormRecaptcha = (form) => {
  const recaptchaSiteKey = form.dataset.recaptchaSiteKey;

  grecaptcha.ready(() => {
    grecaptcha
      .execute(recaptchaSiteKey, { action: "submit" })
      .then((recaptchaToken) => {
        xhrForm(form, { recaptchaToken });
      });
  });
};

addEventDelegate(
  "submit",
  "form[data-recaptchaSiteKey]",
  xhrFormRecaptcha,
  true
);

// // handle recaptcha forms
// const recaptchaHandler = () => {
//   // get the recaptchaForm on the page
//   const recaptchaForm = document.querySelector("#recaptchaForm");

//   // run it through xhrForm
//   xhrForm(recaptchaForm);
// };

// window.recaptchaHandler = recaptchaHandler;
