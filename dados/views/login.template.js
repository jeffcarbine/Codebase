import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";

export default (data) => {
  return base(data, {
    class: "no-header",
    children: [
      new e.SECTION({
        id: "login",
        child: {
          class: "login-form",
          children: [
            {
              class: "logos",
              children: [
                {
                  class: "logo",
                  child: new e.IMG("/dados/images/logo.svg"),
                },
                new e.SPAN({
                  class: "x",
                  textContent: "x",
                }),
                {
                  class: "logo client",
                  child: new e.IMG("/images/logo-dados.svg"),
                },
              ],
            },
            new e.FORM({
              action: "/dados/login",
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
