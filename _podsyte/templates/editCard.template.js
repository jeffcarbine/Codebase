import { MODAL } from "/periodic/components/modal/modal.component.js";
import { IMG } from "/periodic/elements/img/img.element.js";
import { CARD } from "/periodic/components/card/card.component.js";

export const editCardTemplate = ({ accentImage, cardBody, mainModal } = {}) => {
  const children = [];

  if (accentImage) {
    children.push(new IMG(accentImage));
  }

  if (cardBody) {
    children.push({
      class: "card-body",
      children: cardBody,
    });
  }

  if (mainModal) {
    children.push(MODAL(mainModal));
  }

  return CARD({
    className: "edit",
    body: {
      children,
    },
  });
};
