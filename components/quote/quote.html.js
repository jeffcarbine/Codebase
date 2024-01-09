import { BLOCKQUOTE, P } from "../../elements/elements.js";

export const QUOTE = ({ quote, author } = {}) => {
  return {
    class: "quote",
    children: [
      new BLOCKQUOTE({
        textContent: quote,
      }),
      new P({
        class: "author",
        textContent: `-${author}`,
      }),
    ],
  };
};
