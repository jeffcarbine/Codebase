import { FORM } from "../../elements/elements.js";
import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";
import { BTN, FIELD } from "../components.js";

export const SIGNUP = () => {
  return {
    id: "signUp",
    "data-component": "user/signUp",
    child: new FORM({
      id: "signUpForm",
      action: "/user/signUp",
      children: [
        new FIELD({
          id: "firstName",
          name: "firstName",
          required: true,
          label: "First Name",
        }),
        new FIELD({
          id: "lastName",
          name: "lastName",
          required: true,
          label: "Last Name",
        }),
        new FIELD({
          type: "email",
          id: "email",
          name: "email",
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
        new FIELD({
          type: "password",
          id: "passwordConfirm",
          name: "passwordConfirm",
          required: true,
          label: "Confirm Password",
        }),
        new BTN({
          textContent: "Sign Up",
        }),
      ],
    }),
  };
};
