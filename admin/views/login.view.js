import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { FIELD } from "../../components/field/field.component.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "login",
        child: {
          class: "login-form",
          children: [
            new e.IMG({
              src: "/periodic/admin/images/logo-full.svg",
            }),
            new e.FORM({
              action: "/periodic/admin/login",
              class: "style-inputs",
              children: [
                new FIELD({
                  name: "username",
                  id: "username",
                  label: "Username",
                }),
                new FIELD({
                  type: "password",
                  label: "Password",
                  name: "password",
                }),
                new c.BTN("Log In"),
              ],
            }),
          ],
        },
      }),
    ],
  });
};
