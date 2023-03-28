import { base } from "./_backstage.template.js";
import * as e from "../../elements/elements.js";

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
              new e.HEADER({
                children: [
                  {
                    class: "logo",
                    child: new e.IMG("/backstage/images/logo.svg"),
                  },
                  new e.SPAN("x"),
                  {
                    class: "client-logo",
                    child: new e.IMG("/images/logo-backstage.svg"),
                  },
                ],
              }),
              new e.H1("Sign Up for Backstage"),
              new e.FORM({
                action: "/backstage/signup",
                class: "xhr style-inputs",
                children: [
                  new e.EMAIL(),
                  new e.PASSWORD(),
                  new e.PASSWORD({
                    name: "passwordConfirm",
                    id: "passwordConfirm",
                    label: "Confirm Password",
                  }),
                  new e.BTN("Log In"),
                ],
              }),
            ],
          },
        }),
      ],
    },
    [new e.MODULE("/periodic/scripts/xhr/_xhrForm.js")]
  );
};
