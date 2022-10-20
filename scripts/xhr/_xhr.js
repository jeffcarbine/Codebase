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

export default (method, path, data = {}, callbacks = {}) => {
  // set default methods
  if (callbacks.success === undefined) {
    callbacks.success = (request) => {
      console.log(request.response);
    };
  }

  if (callbacks.error === undefined) {
    callbacks.error = (request) => {
      console.log(request.response);
    };
  }

  if (callbacks.failure === undefined) {
    callbacks.failure = (request) => {
      console.log(request.response);
    };
  }

  if (callbacks.progress === undefined) {
    callbacks.progress = (event) => {
      if (event.lengthComputable) {
        console.log(`Received ${event.loaded} of ${event.total} bytes`);
      } else {
        console.log(`Received ${event.loaded} bytes`);
      }
    };
  }

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
      console.log(request);
    }
  };

  request.onprogress = (event) => {
    callbacks.progress(event);
  };

  request.onerror = () => {
    callbacks.error(request.response);
  };

  const requestBody = JSON.stringify(data);

  request.send(requestBody);
};
