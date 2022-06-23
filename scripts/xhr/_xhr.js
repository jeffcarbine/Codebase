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
  const request = new XMLHttpRequest();
  request.open(method, path);

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.onload = function () {
    if (request.status === 200) {
      success(request);
    } else if (request.status === 500) {
      failure(request);
    } else {
      error(request);
    }
  };

  request.send(JSON.stringify(data));
};

const xhrForm = function (path, form) {
  // get the formData
  const formData = new FormData(form);

  let json = {};

  formData.forEach(function (value, key) {
    json[key] = value;
  });

  // default behaviours for success, error and failure
  const success = function () {};

  const error = function () {};

  const failure = function () {};

  // and now pass this all to the xhr function
  xhr("POST", path, success, error, failure, json);
};
