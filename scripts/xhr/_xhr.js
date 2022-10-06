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

export default (
  method,
  path,
  success = (request) => {
    console.log(request.response);
  },
  error = (request) => {
    console.log(request.response);
  },
  failure = (request) => {
    console.log(request.response);
  },
  data = {}
) => {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.onload = function () {
    console.log(request.status);
    if (request.status === 200) {
      success(request);
    } else if (request.status === 500) {
      failure(request);
    } else {
      error(request);
    }
  };

  request.onerror = function () {
    error(request.response);
  };

  const requestBody = JSON.stringify(data);

  request.send(requestBody);
};
