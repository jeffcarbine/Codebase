import { BUTTON, SPAN } from "../../elements/elements.js";

export const ACCORDION = ({
  className = "",
  title,
  action = "Toggle",
  button = {},
  body,
  open = false,
} = {}) => {
  const accordionBody = {
    class: `accordion-body ${open ? "open" : ""}`,
    style: open ? "height: auto" : "",
    child: body,
  };

  const generateTitle = () => {
    if (typeof title === "string") {
      return new SPAN(title);
    } else {
      return title;
    }
  };

  const generateAccordionButton = () => {
    const accordionButton = new BUTTON(button);

    accordionButton.class =
      accordionButton.class + ` accordion-button ${open ? "open" : ""}`;
    accordionButton["aria-label"] = action;

    return accordionButton;
  };

  return {
    "data-component": "accordion",
    class: `accordion ${className} ${open ? "open" : ""}`,
    children: [
      {
        class: "accordion-title",
        children: [generateTitle(), generateAccordionButton()],
      },
      accordionBody,
    ],
  };
};
