import * as e from "../../elements/elements.js";

export const cardTemplate = ({ body = {}, className = "" } = {}) => {
  return {
    class: "card " + className,
    child: body,
  };
};
