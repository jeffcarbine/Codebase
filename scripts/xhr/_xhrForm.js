import { addEventDelegate } from "../eventdelegate/_eventdelegate.js";
import xhr from "./_xhr.js";
import { toast } from "../../components/alert/_alert.js";

const xhrForm = function (form) {
  // get the data from the form
  const formData = new FormData(form),
    method = form.method,
    action = form.action;

  // add the loading class to the form
  if (!form.classList.contains("loading")) {
    form.classList.add("loading");
  }

  let json = {};

  formData.forEach(function (value, key) {
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
    console.log(string);
    form.classList.remove("loading");

    toast(string, { status });
  };

  // default behaviours for success, error and failure
  const success = (request) => {
    const redirect = form.dataset.redirect !== undefined;

    if (redirect) {
      window.location = form.dataset.redirect;
    } else {
      renderResponse(request.response, "success");
      form.reset();

      // remove success message after two seconds
      setTimeout(() => {
        delete responseBox.dataset.status;
      }, 2000);
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
    xhr(method, action, json, { success, error, failure });
  }, 1000);
};

// run xhrForm on any form with a class of xhr
addEventDelegate("submit", "form.xhr", xhrForm, true);
