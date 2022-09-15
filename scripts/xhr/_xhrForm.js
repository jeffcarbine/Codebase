import { addEventDelegate } from "../eventdelegate/_eventdelegate.js";
import xhr from "./_xhr.js";

const xhrForm = function (form) {
  // get the data from the form
  const formData = new FormData(form),
    method = form.method,
    action = form.action;

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

  console.log(json);

  // get the expected response box
  const responseBox = form.querySelector(".response");

  const renderResponse = function (string, status) {
    responseBox.dataset.status = status;
    responseBox.textContent = string;
  };

  // default behaviours for success, error and failure
  const success = function (request) {
    const redirect = form.dataset.redirect !== undefined;

    if (redirect) {
      window.location = form.dataset.redirect;
    } else {
      response.renderResponse(request.response, "success");
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

  const failure = function (request) {
    renderResponse(request.response, "failure");
  };

  // and now pass this all to the xhr function
  xhr(method, action, success, error, failure, json);
};

// run xhrForm on any form with a class of xhr
addEventDelegate("submit", "form.xhr", xhrForm, true);
