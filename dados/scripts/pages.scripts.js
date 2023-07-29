import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import * as e from "/periodic/elements/elements.js";
import { cardTemplate } from "/periodic/components/card/card.template.js";
import { xhr, xhrForm } from "/periodic/scripts/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";

const retrievePages = () => {
  const pagesTarget = document.querySelector("#pages");
  pagesTarget.classList.add("loading");

  const generatePagesCards = (pages) => {
    pagesTarget.classList.remove("loading");
    pagesTarget.innerHTML = "";

    pages.forEach((page) => {
      const heading = page.homepage
        ? [new e.ICON("home"), page.name]
        : page.name;

      const pageCard = renderTemplate(
        cardTemplate({
          body: {
            children: [
              {
                class: "title-edit",
                children: [
                  new e.H2(heading),
                  {
                    class: "edit",
                    child: new e.BTN({
                      href: "/admin/pages/" + page._id,
                      children: [
                        new e.ICON("edit"),
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
          },
          className: "edit",
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
