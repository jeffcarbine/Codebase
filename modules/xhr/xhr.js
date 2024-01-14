import { toast } from "../../components/alert/alert.js";
import { stripHtml } from "../formatString/formatString.js";

/**
 * XHR
 * Simplifies making XMLHttpRequests
 *
 */

const defaultResponse = (request) => {
  console.log(request.response);
};

export const xhr = ({
  method = "POST",
  path = "/",
  body = {},
  contentType = "application/json;charset=UTF-8",
  authorization,
  success = defaultResponse,
  error = defaultResponse,
  failure = defaultResponse,
  progress,
} = {}) => {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", contentType);

  if (authorization !== undefined) {
    request.setRequestHeader("Authorization", authorization);
  }

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

  if (progress !== undefined) {
    request.onprogress = (event) => {
      progress(event);
    };
  }

  const requestBody = JSON.stringify(body);

  request.send(requestBody);
};

const toastResponse = (string, status, form) => {
  const message = stripHtml(string);
  toast({ message, dismissable: true, status, parent: form });
};

const toastSuccess = (request, body, form) => {
  const string = request.response;

  toastResponse(string, "success", form);
};

const toastError = (request, body, form) => {
  const string = request.response;

  toastResponse(string, "caution", form);
};

const toastFailure = (request, body, form) => {
  const string = request.response;

  toastResponse(string, "urgent", form);
};

export const xhrForm = ({
  form,
  success = toastSuccess,
  error = toastError,
  failure = toastFailure,
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
  const formSuccess = (request) => {
    form.classList.remove("loading");

    success(request, body, form);

    form.reset();

    // check to see if we have any field previews in the form
    const previews = form.querySelectorAll(".preview");

    if (previews.length > 0) {
      previews.forEach((preview) => {
        // get the image and remove the src and set to display none
        const image = preview.querySelector("img");
        image.removeAttribute("src");
        image.style.display = "none";
      });
    }
  };

  const formError = (request) => {
    form.classList.remove("loading");

    // if (request.status === 400) {
    //   if (form.dataset.http400 !== undefined) {
    //     message = form.dataset.http400;
    //   }
    // }

    // if (request.status === 401) {
    //   if (form.dataset.http401 !== undefined) {
    //     message = form.dataset.http401;
    //   }
    // }

    error(request, null, form);
  };

  const formFailure = (request) => {
    form.classList.remove("loading");

    failure(request, null, form);
  };

  // const progress = (event) => {
  //   console.log(progress);
  // };

  // create the xhr params
  const params = {
    method,
    path: action,
    body,
    success: formSuccess,
    error: formError,
    failure: formFailure,
  };

  // and now pass this all to the xhr function
  xhr(params);
};

export const xhrFormRecaptcha = ({
  form,
  success = toastSuccess,
  error = toastError,
  failure = toastFailure,
  body = {},
}) => {
  const recaptchaSiteKey = form.dataset.recaptchaSiteKey;

  grecaptcha.ready(() => {
    grecaptcha
      .execute(recaptchaSiteKey, { action: "submit" })
      .then((recaptchaToken) => {
        body.recaptchaToken = recaptchaToken;
        xhrForm({ form, body, success, error, failure });
      });
  });
};
