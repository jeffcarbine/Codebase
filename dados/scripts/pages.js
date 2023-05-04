import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import * as e from "/periodic/elements/elements.js";
import { card } from "/periodic/components/card/card.template.js";
import { xhr, xhrForm } from "/periodic/scripts/xhr/_xhr.js";
import { renderTemplate } from "/periodic/template/_renderTemplate.js";

const retrievePages = () => {
  const pagesTarget = document.querySelector("#pages");
  pagesTarget.classList.add("loading");

  const generatePagesCards = (pages) => {
    pagesTarget.classList.remove("loading");
    pagesTarget.innerHTML = "";

    pages.forEach((page) => {
      const pageCard = renderTemplate(
        card({
          children: [
            new e.H2(page.name),
            new e.BTN({
              href: "/admin/pages/" + page._id,
              children: [new e.ICON("edit"), "Edit"],
            }),
          ],
        })
      );

      pagesTarget.appendChild(pageCard);
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
  const formSuccess = (response) => {
    const pageId = JSON.parse(response);

    window.location = "/admin/pages/" + pageId;
  };

  xhrForm({ form, formSuccess });
};

addEventDelegate("submit", "#addEditPage", submitAddPages, true);
