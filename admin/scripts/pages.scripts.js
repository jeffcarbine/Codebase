import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { CARD } from "/periodic/components/card/card.component.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { actionCardTemplate } from "../templates/actionCard.template.js";

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
        actionCardTemplate({
          info: [new e.H2(heading)],
          actions: [
            new c.BTN({
              href: "/periodic/admin/pages/" + page._id,
              child: new c.ICON("edit"),
              class: "icon-only",
              "aria-label": "Edit Page",
            }),
          ],
          body: [],
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

  xhr({ path: "/periodic/admin/pages/retrieve", success });
};

retrievePages();

const submitAddPages = (form) => {
  const success = (request) => {
    const response = request.response,
      pageId = JSON.parse(response);

    window.location = "/periodic/admin/pages/" + pageId;
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "#addEditPage", submitAddPages, true);
