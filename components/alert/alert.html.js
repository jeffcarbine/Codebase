import { P } from "../../elements/elements.js";

export const ALERT = (style, message) => {
  return {
    class: `alert ${style}`,
    child: new P(message),
  };
};
