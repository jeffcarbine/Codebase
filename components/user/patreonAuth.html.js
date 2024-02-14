import { patreonOauthUrl } from "../../apis/patreon.js";
import { H1, P } from "../../elements/elements.js";
import { BTNCONTAINER, ICON } from "../components.js";

export const PATREONAUTH = (data) => {
  return {
    class: "patreonAuth",
    children: [
      {
        class: "text-overlay",
        children: [
          new ICON("patreon"),
          new H1("Connect to Patreon"),
          new P(
            "Unlock additional rewards on our website by connecting your Patreon account"
          ),
          new BTNCONTAINER(
            {
              href: patreonOauthUrl,
              textContent: "Authenticate with Patreon",
            },
            "centered"
          ),
        ],
      },
    ],
  };
};

export const AUTHORIZINGPATREON = (code) => {
  return {
    class: "patreonAuth",
    "data-component": "user/patreonAuth",
    children: [
      {
        class: "text-overlay",
        children: [
          new ICON("patreon"),
          new H1("Authorizing Patreon"),
          new P("Please wait while we authorize your Patreon account..."),
          {
            class: "loading",
          },
        ],
      },
    ],
  };
};
