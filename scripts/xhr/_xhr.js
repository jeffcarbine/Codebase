/**
 * XHR
 * Simplifies making XMLHttpRequests
 *
 * example:
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
 * xhr("POST", "https://testurl.com/test", success, error, failure, "FOO=bar",);
 *
 */

export default (method, path, success, error, failure, data) => {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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

  const requestBody = new URLSearchParams(data).toString();

  request.send(requestBody);
};
