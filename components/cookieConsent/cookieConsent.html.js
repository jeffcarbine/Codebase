import { A, FORM, H2, P } from "../../elements/elements.js";
import { BTNCONTAINER, FIELD, MODAL } from "../components.js";

export const COOKIECONSENT = ({
  cookiesDetected = false,
  analyticCookiesDetected = false,
  analyticCookiesOn = true,
  marketingCookiesDetected = false,
  marketingCookiesOn = true,
}) => {
  return {
    id: "cookieConsent",
    "data-component": "cookieConsent",
    children: [
      {
        class: `message ${cookiesDetected ? "hidden" : ""}`,
        children: [
          {
            class: "explanation",
            children: [
              new H2("Cookie Consent"),
              new P([
                "Hello! We use essential cookies in order to make our site function - however, with your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking 'Accept All', you agree to the storing of non-essential cookies on your device. You can learn more about how we use cookies by visiting our ",
                new A({ href: "/cookie-policy", textContent: "Cookie Policy" }),
                ".",
              ]),
              new P(
                "You can change your cookie settings now by clicking 'Preferences' or at any time by going to 'Cookie Preferences' in the footer."
              ),
            ],
          },
          {
            class: "actions",
            child: new BTNCONTAINER(
              [
                {
                  class: "sm",
                  textContent: "Accept All",
                  id: "acceptAllCookies",
                },
                {
                  class: "subtle sm",
                  textContent: "Preferences",
                  "data-modal": "cookieToggle",
                },
              ],
              "centered"
            ),
          },
        ],
      },
      MODAL({
        modalBody: {
          children: [
            new H2("Cookie Preferences"),
            new P(
              "We use different types of cookies to optimize your experience on our website. You may choose which types of cookies to allow and can change your preferences at any time. Remember that disabling cookies may affect your experience on the website. You can learn more about how we use cookies by visiting our Cookie Policy and Privacy Policy."
            ),
            new FORM({
              id: "cookiePreferences",
              children: [
                new FIELD({
                  type: "checkbox",
                  id: "necessary",
                  checked: true,
                  disabled: true,
                  label: "Necessary",
                  help: "These cookies are essential for the website to function, and cannot be disabled.",
                }),
                new FIELD({
                  type: "checkbox",
                  id: "analytics",
                  label: "Analytics",
                  checked: analyticCookiesDetected ? analyticCookiesOn : true,
                  name: "analyticCookies",
                  help: "These cookies help us understand how visitors interact with the website, and help us to continuously improve the user experience.",
                }),
                new FIELD({
                  type: "checkbox",
                  id: "marketing",
                  label: "Marketing",
                  checked: marketingCookiesDetected ? marketingCookiesOn : true,
                  name: "marketingCookies",
                  help: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging.",
                }),
                new BTNCONTAINER({
                  id: "saveCookiePreferences",
                  class: "sm",
                  textContent: "Save Preferences",
                }),
              ],
            }),
          ],
        },
        id: "cookieToggle",
      }),
    ],
  };
};
