import { P } from "../../elements/elements.js";
import { ICON } from "../components.js";

export const ALERT = ({ type = "info", message, icon }) => {
  const children = [
    {
      class: "message",
      child: new P(message),
    },
  ];

  if (icon) {
    children.unshift(new ICON(icon));
  }

  return {
    class: `alert ${type} ${icon ? "has-icon" : ""}`,
    children,
  };
};
