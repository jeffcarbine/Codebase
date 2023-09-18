import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { CARD } from "/periodic/components/card/card.component.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { editCardTemplate } from "../templates/editCard.template.js";

const retrievePages = () => {
  const pagesTarget = document.querySelector("#pages");
  pagesTarget.classList.add("loading");

  const generatePagesCards = (pages) => {
    pagesTarget.classList.remove("loading");
    pagesTarget.innerHTML = "";

    pages.forEach((page) => {
      const heading = page.homepage
        ? [new c.ICON("home"), page.name]
        : page.name;

      const pageCard = renderTemplate(
        editCardTemplate({
          cardBody: [
            {
              class: "title-edit",
              children: [
                new e.H2(heading),
                {
                  class: "edit",
                  child: new c.BTN({
                    href: "/admin/pages/" + page._id,
                    children: [
                      new c.ICON("edit"),
                      new e.SPAN({ class: "text", textContent: "Edit" }),
                    ],
                  }),
                },
              ],
            },
            {
              class: "preview",
              child: new e.P(
                `${page.datapoints.length} datapoint${
                  page.datapoints.length === 1 ? "" : "s"
                }`
              ),
            },
          ],
        })
      );

      if (page.homepage) {
        pagesTarget.prepend(pageCard);
      } else {
        pagesTarget.appendChild(pageCard);
      }
    });
  };

  const success = (request) => {
    const response = JSON.parse(request.response);

    generatePagesCards(response);
  };

  xhr({ path: "/admin/pages/retrieve", success });
};

retrievePages();

const submitAddPages = (form) => {
  const success = (response) => {
    const pageId = JSON.parse(response);

    window.location = "/admin/pages/" + pageId;
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "#addEditPage", submitAddPages, true);
