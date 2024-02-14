import { xhr } from "../../modules/xhr/xhr.js";

const success = (request) => {
  // refresh the page without the query parameters
  window.location.href = "/rewards";
};

// get the code from the query parameters
const query = new URLSearchParams(window.location.search);
const code = query.get("code");

// send the code via xhr
xhr({ path: "/user/patreonAuth", body: { code }, success });
