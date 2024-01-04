import { FORM } from "../../elements/elements.js";
import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";
import { BTN, FIELD } from "../components.js";

export const SIGNUP = (tiers) => {
  // sort the tiers by amount
  tiers.sort((a, b) => {
    return a.amount - b.amount;
  });

  const generateTierOptions = () => {
    const options = [];

    tiers.forEach((tier) => {
      options.push({
        value: tier.amount,
        name: `${tier.title} - ${formatCents(tier.amount)}/Month`,
      });
    });

    return options;
  };

  const generateTierDescriptions = () => {
    const descriptions = [];

    tiers.forEach((tier) => {
      descriptions.push({
        id: `tierDescription${tier.amount}`,
        textContent: tier.description,
        style: {
          display: "none",
        },
      });
    });

    return descriptions;
  };

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
        new FIELD({
          type: "select",
          id: "pledge",
          name: "pledge",
          required: true,
          label: "Tier",
          options: generateTierOptions(),
        }),
        {
          id: "tierDescriptions",
          children: generateTierDescriptions(),
        },
        new BTN({
          textContent: "Sign Up",
        }),
      ],
    }),
  };
};
