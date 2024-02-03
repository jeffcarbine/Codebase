import { FORM, H2, P } from "../../elements/elements.js";
import { BTNCONTAINER, FIELD, MODAL } from "../components.js";

export const COOKIECONSENT = ({
  cookiesDetected = false,
  analyticCookiesOn = true,
  marketingCookiesOn = true,
}) => {
  console.log(analyticCookiesOn, marketingCookiesOn);

  return {
    id: "cookieConsent",
    "data-component": "cookieConsent",
    children: [
      {
        class: `message ${cookiesDetected ? "hidden" : ""}`,
        children: [
          {
            class: "explanation",
            child: new P(
              "We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking “Accept,” you agree to our website's cookie use as described in our Cookie Policy. You can change your cookie settings at any time by clicking 'Preferences.'"
            ),
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
                  checked: analyticCookiesOn,
                  name: "analyticCookies",
                  help: "These cookies help us understand how visitors interact with the website, and help us to continuously improve the user experience.",
                }),
                new FIELD({
                  type: "checkbox",
                  id: "marketing",
                  label: "Marketing",
                  checked: marketingCookiesOn,
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
