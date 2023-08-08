import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.SECTION({
          id: "login",
          child: {
            class: "login-form",
            children: [
              new e.H1("Welcome to Podsyte!"),
              new e.H2("Create an Account"),
              new e.FORM({
                action: "/admin/signup",
                class: "xhr style-inputs",
                children: [
                  new e.EMAIL(),
                  new e.PASSWORD(),
                  new e.PASSWORD({
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
    },
    [new e.MODULE("/periodic/modules/xhr/_xhrForm.js")]
  );
};
