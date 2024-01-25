import { toast } from "../../components/alert/alert.js";
import { stripHtml } from "../formatString/formatString.js";

const defaultResponse = (request) => {
  console.log(request.response);
};

export const xhr = ({
  method = "POST",
  path = "/",
  body = {},
  contentType = "application/json;charset=UTF-8",
  authorization,
  statusHandlers = {},
  success = defaultResponse,
  error = defaultResponse,
  failure = defaultResponse,
  defaultHandler = defaultResponse,
  progress,
} = {}) => {
  // start by creating a request
  const request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", contentType);

  if (authorization !== undefined) {
    request.setRequestHeader("Authorization", authorization);
  }

  request.onload = () => {
    const handler = statusHandlers[request.status];
    if (handler) {
      handler(request);
    } else {
      // if there is no matching handler, use the default for the code type

      // 200s
      if (request.status >= 200 && request.status < 300) {
        success(request);
        // 400s
      } else if (request.status >= 400 && request.status < 500) {
        error(request);
        // 500s
      } else if (request.status >= 500 && request.status < 600) {
        failure(request);
        // default
      } else {
        defaultHandler(request);
      }
    }
  };

  request.ontimeout = () => {
    defaultHandler(request.response);
  };

  request.onerror = () => {
    defaultHandler(request.response);
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

const toastSuccess = (request, form, message) => {
  toastResponse(message, "success", form);
};

const toastError = (request, form, message) => {
  toastResponse(message, "caution", form);
};

const toastFailure = (request, form, message) => {
  toastResponse(message, "urgent", form);
};

export const xhrForm = ({
  form,
  successMessage,
  success = toastSuccess,
  errorMessage,
  error = toastError,
  failureMessage,
  failure = toastFailure,
  responseMessages = {},
  responseHandler = {},
  body = {},
  reset = true,
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

  // default behaviour for success
  // takes in the success message if undefined, otherwise
  // uses the request response
  const formSuccess = (request) => {
    form.classList.remove("loading");

    const message = successMessage || request.response;

    success(request, form, message);

    if (reset) {
      form.reset();
    }

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

  // default behavior for error
  // takes in the error message if undefined, otherwise
  // uses the request response
  const formError = (request) => {
    form.classList.remove("loading");

    const message = errorMessage || request.response;

    error(request, form, message);
  };

  // default behavior for failure
  // takes in the failure message if undefined, otherwise
  // uses the request response
  const formFailure = (request) => {
    form.classList.remove("loading");

    const message = failureMessage || request.response;

    failure(request, form, message);
  };

  for (const [key, value] of Object.entries(responseMessages)) {
    responseHandler[key] = (request) => {
      const message = value || request.response;

      // create status (success, error, failure) from the key (200, 400 or 500)
      let status = null;

      if (key >= 200 && key < 300) {
        status = "success";
      } else if (key >= 400 && key < 500) {
        status = "caution";
      } else if (key >= 500 && key < 600) {
        status = "urgent";
      }

      toastResponse(message, status, form);
    };
  }

  const params = {
    method,
    path: action,
    body,
    success: formSuccess,
    error: formError,
    failure: formFailure,
    responseHandler,
  };

  // and now pass this all to the xhr function
  xhr(params);
};

export const xhrFormRecaptcha = ({
  form,
  success = toastSuccess,
  error = toastError,
  failure = toastFailure,
  responseHandler = {},
  body = {},
}) => {
  const recaptchaSiteKey = form.dataset.recaptchaSiteKey;

  grecaptcha.ready(() => {
    grecaptcha
      .execute(recaptchaSiteKey, { action: "submit" })
      .then((recaptchaToken) => {
        body.recaptchaToken = recaptchaToken;
        xhrForm({ form, body, success, error, failure, responseHandler });
      });
  });
};
