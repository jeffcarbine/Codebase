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
  callbacks = {
    success: defaultResponse,
    error: defaultResponse,
    failure: defaultResponse,
  },
} = {}) => {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.onload = () => {
    if (request.status === 200) {
      callbacks.success(request);
    } else if (request.status === 500) {
      callbacks.failure(request);
    } else {
      callbacks.error(request);
    }
  };

  request.onerror = () => {
    callbacks.error(request.response);
  };

  if (callbacks.progress !== undefined) {
    request.onprogress = (event) => {
      callbacks.progress(event);
    };
  }

  const requestBody = JSON.stringify(body);

  request.send(requestBody);
};
