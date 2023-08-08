import { BUTTON, SPAN } from "../../elements/elements.js";

export const ACCORDION = ({ className = "", title = "", body = "" } = {}) => {
  const accordionBody = body;
  accordionBody.class =
    accordionBody.class === undefined
      ? "accordion-body"
      : accordionBody.class + " accordion-body";

  return {
    class: "accordion " + className,
    children: [
      new BUTTON({
        class: "accordion-button",
        child: new SPAN(title),
      }),
      accordionBody,
    ],
  };
};
