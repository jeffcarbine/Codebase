import { toast } from "../../components/alert/alert.js";

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
  requestHeader = "application/json;charset=UTF-8",
  success = defaultResponse,
  error = defaultResponse,
  failure = defaultResponse,
  progress,
} = {}) => {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", requestHeader);

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
  form.classList.remove("loading");

  toast({ message: string, dismissable: true, status, parent: form });
};

export const xhrForm = ({
  form,
  success = toastResponse,
  error = toastResponse,
  failure = toastResponse,
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
    success(request.response, "success", form);
    form.reset();

    // check to see if we have any previews in the form
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
    let message = request.response;

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

    error(message, "error", form);
  };

  const formFailure = (request) => {
    failure(request.response, "failure", form);
  };

  // const progress = (event) => {
  //   console.log(progress);
  // };

  console.log(body);

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
  success = toastResponse,
  error = toastResponse,
  failure = toastResponse,
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
