import { base } from "./_backstage.template.js";
import * as e from "../../elements/elements.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "login",
        child: {
          class: "login-form",
          children: [
            new e.HEADER([
              {
                class: "logo",
                child: new e.IMG("/backstage/images/logo.svg"),
              },
              new e.SPAN("x"),
              {
                class: "client-logo",
                child: new e.IMG("/images/logo-backstage.svg"),
              },
            ]),
            new e.FORM({
              action: "/backstage/login",
              class: "style-inputs",
              children: [
                new e.EMAIL({
                  name: "username",
                  id: "username",
                }),
                new e.PASSWORD(),
                new e.BTN("Log In"),
              ],
            }),
          ],
        },
      }),
    ],
  });
};
