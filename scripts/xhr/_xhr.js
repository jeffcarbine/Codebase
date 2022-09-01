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

const xhr = function (method, path, success, error, failure, data) {
  // start by creating a request
  let request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  request.onload = function () {
    if (request.status === 200) {
      success(request.response);
    } else if (request.status === 500) {
      failure(request.response);
    } else {
      error(request.response);
    }
  };

  request.onerror = function () {
    error(request.response);
  };

  const requestBody = new URLSearchParams(data).toString();

  request.send(requestBody);
};

const xhrForm = function (path, form) {
  // get the formData
  const formData = new FormData(form);

  let json = {};

  formData.forEach(function (value, key) {
    json[key] = value;
  });

  // get the expected response box
  const responseBox = form.querySelector("#response");

  const renderResponse = function (string, status) {
    responseBox.className = status;
    responseBox.textContent = string;
  };

  // default behaviours for success, error and failure
  const success = function (response) {
    renderResponse(response, "success");
    form.reset();
  };

  const error = function (response) {
    renderResponse(response, "error");
  };

  const failure = function (response) {
    renderResponse(response, "failure");
  };

  // and now pass this all to the xhr function
  xhr("POST", path, success, error, failure, json);
};
