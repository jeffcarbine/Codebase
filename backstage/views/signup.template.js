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
            new H1("Sign Up for Backstage"),
            new FORM({
              class: "style-inputs",
              children: [
                new EMAIL(),
                new PASSWORD(),
                new PASSWORD({
                  name: "passwordconfirm",
                  id: "passwordconfirm",
                  label: "Confirm Password",
                }),
                new BTN("Log In"),
              ],
            }),
          ],
        },
      }),
    ],
  });
};
