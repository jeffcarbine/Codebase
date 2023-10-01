import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { logoTemplate } from "../templates/logo.template.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "login",
        child: {
          class: "login-form",
          children: [
            logoTemplate,
            new e.H2("Create an Account"),
            new e.FORM({
              action: "/periodic/admin/signup",
              class: "xhr style-inputs",
              children: [
                new c.FIELD({
                  name: "email",
                  id: "email",
                  label: "Email",
                  type: "email",
                }),
                new c.FIELD({
                  type: "password",
                  name: "password",
                  id: "password",
                  label: "Password",
                }),
                new c.FIELD({
                  type: "password",
                  name: "passwordConfirm",
                  id: "passwordConfirm",
                  label: "Confirm Password",
                }),
                new c.BTN("Create Account"),
              ],
            }),
          ],
        },
      }),
    ],
  });
};
