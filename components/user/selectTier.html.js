import { SQUARECARDCONTAINER } from "./squareCardContainer.html.js";
import { FIELD, BTN } from "../components.js";
import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";

export const SELECTTIER = (tiers) => {
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
    id: "selectTier",
    children: [
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
      SQUARECARDCONTAINER,
      new BTN({
        id: "submitCardData",
        textContent: "Submit",
      }),
    ],
  };
};
