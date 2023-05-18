import { toast } from "../../components/alert/_alert.js";

/**
 * XHR
 * Simplifies making XMLHttpRequests
 *
 * example:
 *
 * const data = { foo: "bar" }
 *
 * const success = function(xhr) {
 *    console.log(xhr.status);
 * };
 *
 * const error = function(xhr) {
 *    console.warn(xhr.status);
 * }
 *
 * const failure = function(xhr) {
 *    console.warn(xhr.status);
 * }
 *
 * xhr("POST", "https://testurl.com/test", success, error, failure, data);
 *
 */

const defaultResponse = (request) => {
  console.log(request.response);
};

export const xhr = ({
  method = "POST",
  path = "/",
  body = {},
  success = defaultResponse,
  error = defaultResponse,
  failure = defaultResponse,
} = {}) => {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.onload = () => {
    if (request.status === 200) {
      success(request);
    } else if (request.status === 500) {
      failure(request);
    } else {
      error(request);
    }
  };

  request.onerror = () => {
    error(request.response);
  };

  // if (progress !== undefined) {
  //   request.onprogress = (event) => {
  //     progress(event);
  //   };
  // }

  const requestBody = JSON.stringify(body);

  request.send(requestBody);
};

const toastResponse = (form, message, status) => {
  form.classList.remove("loading");

  toast({ message, status, parent: form });
};

export const xhrForm = ({
  form,
  formSuccess = toastResponse,
  formError = toastResponse,
  formFailure = toastResponse,
  body = {},
}) => {
  // get the data from the form
  const formData = new FormData(form),
    method = form.method,
    action = form.action;

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
      if (body[parent] === undefined) {
        body[parent] = {};
      }

      body[parent][child] = value;
    } else {
      body[key] = value;
    }
  });

  // default behaviours for success, error and failure
  const success = (request) => {
    const redirect = form.dataset.redirect !== undefined;

    if (redirect) {
      window.location = form.dataset.redirect;
    } else {
      formSuccess(form, request.response, "success");
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

    formError(form, message, "error");
  };

  const failure = (request) => {
    formFailure(form, request.response, "failure");
  };

  // const progress = (event) => {
  //   console.log(progress);
  // };

  // and now pass this all to the xhr function

  xhr({
    method,
    path: action,
    body,
    callbacks: { success, error, failure },
  });
};

export const xhrFormRecaptcha = (form) => {
  const recaptchaSiteKey = form.dataset.recaptchaSiteKey;

  grecaptcha.ready(() => {
    grecaptcha
      .execute(recaptchaSiteKey, { action: "submit" })
      .then((recaptchaToken) => {
        xhrForm({ form, body: { recaptchaToken } });
      });
  });
};
