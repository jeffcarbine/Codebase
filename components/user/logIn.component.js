import { FORM } from "../../elements/elements.js";
import { BTN, FIELD } from "../components.js";

export const LOGIN = () => {
  return {
    id: "logIn",
    "data-component": "user/logIn",
    child: new FORM({
      id: "logInForm",
      action: "/user/logIn",
      children: [
        new FIELD({
          type: "email",
          id: "username",
          name: "username",
          required: true,
          label: "Email",
        }),
        new FIELD({
          type: "password",
          id: "password",
          name: "password",
          required: true,
          label: "Password",
        }),
        new BTN({
          textContent: "Log In",
        }),
      ],
    }),
  };
};
