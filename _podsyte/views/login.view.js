import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "/periodic/components/components.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "login",
        child: {
          class: "login-form",
          children: [
            new e.FORM({
              action: "/admin/login",
              class: "style-inputs",
              children: [
                new e.EMAIL({
                  name: "username",
                  id: "username",
                }),
                new e.PASSWORD(),
                new c.BTN("Log In"),
              ],
            }),
          ],
        },
      }),
    ],
  });
};
