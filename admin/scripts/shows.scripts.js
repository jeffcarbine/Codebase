import { xhr } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { CARD } from "/periodic/components/card/card.component.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { showFormTemplate } from "../templates/showForm.template.js";

const generateShowList = () => {
  const showList = document.getElementById("showList");

  const success = (request) => {
    showList.classList.remove("loading");

    const shows = JSON.parse(request.response);

    for (let i = 0; i < shows.length; i++) {
      const showData = shows[i],
        showCard = renderTemplate(
          CARD({
            className: "edit",
            body: {
              children: [
                {
                  class: "title-edit",
                  children: [
                    new e.H2(showData.title),
                    {
                      class: "edit",
                      child: new c.BTN({
                        href: "/periodic/admin/shows/" + showData._id,
                        children: [
                          new c.ICON("eye"),
                          new e.SPAN({ class: "text", textContent: "View" }),
                        ],
                        //"data-modal": "_" + showData._id,
                      }),
                    },
                  ],
                },
                {
                  class: "preview",
                  child: {},
                },
                // c.MODAL({
                //   modalBody: showFormTemplate(e, c, {
                //     showData,
                //     action: "/periodic/admin/shows/edit",
                //   }),
                //   id: `_${showData._id}`,
                // }),
              ],
            },
          })
        );

      showList.appendChild(showCard);
    }
  };

  xhr({ path: "/periodic/admin/shows/retrieve", success });

  return showList;
};

generateShowList();
