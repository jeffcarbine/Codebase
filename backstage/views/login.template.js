import { base } from "./_backstage.template.js";
import {
  SECTION,
  H1,
  FORM,
  EMAIL,
  PASSWORD,
  BTN,
  HEADER,
  IMG,
  SPAN,
  MODULE,
} from "../../template/elements.js";

export default (data) => {
  return base(data, {
    children: [
      new SECTION({
        id: "login",
        child: {
          class: "login-form",
          children: [
            new HEADER({
              children: [
                {
                  class: "logo",
                  child: new IMG("/backstage/images/logo.svg"),
                },
                new SPAN("x"),
                {
                  class: "client-logo",
                  child: new IMG("/images/logo-backstage.svg"),
                },
              ],
            }),
            new FORM({
              action: "/backstage/login",
              class: "style-inputs",
              children: [
                new EMAIL({
                  name: "username",
                  id: "username",
                }),
                new PASSWORD(),
                new BTN("Log In"),
              ],
            }),
          ],
        },
      }),
    ],
  });
};
