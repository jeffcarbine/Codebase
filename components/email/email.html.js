import * as e from "../../elements/elements.js";
import { deCamelize } from "../../modules/formatString/formatString.js";

export const emailTemplate = (title, body, logo) => {
  const messageList = () => {
    const list = [];

    for (let key in body) {
      if (key !== "recaptchaToken") {
        const li = new e.LI({
          style: {
            margin: ".5rem 0",
          },
          children: [new e.STRONG(deCamelize(key) + ": "), body[key]],
        });
        list.push(li);
      }
    }

    return list;
  };

  return new e.HTML({
    metas: [
      { charset: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { "http-equiv": "X-UA-Compatible", content: "ie=edge" },
    ],
    style: {
      display: "block",
      fontFamily: "system-ui, sans-serif",
    },
    body: [
      new e.MAIN({
        style: {
          padding: "1rem",
        },
        child: {
          style: {
            display: "block",
            maxWidth: "30rem",
            margin: "0 auto",
            background: "rgba(0,0,0,.025)",
            padding: "2rem",
            boxShadow: "0 0 5px 0 rgba(0,0,0,.2)",
          },
          children: [
            new e.IMG({
              if: logo !== undefined,
              style: {
                width: "100%",
                maxWidth: "10rem",
                margin: "1rem 0",
              },
              src: logo?.src,
              alt: logo?.alt,
            }),
            new e.H1({
              style: {
                margin: 0,
              },
              textContent: title,
            }),
            {
              tagName: "ul",
              class: "message",
              children: messageList(),
            },
          ],
        },
      }),
    ],
  });
};
