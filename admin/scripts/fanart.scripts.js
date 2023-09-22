import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { dataBind } from "/periodic/modules/dataBind/dataBind.js";
import { xhr } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { CARD } from "/periodic/components/card/card.component.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { BTNCONTAINER, TOGGLESINGLE } from "/periodic/components/components.js";
import { twoStepDeleteTemplate } from "/periodic/admin/templates/twoStepDelete.template.js";
import { editCardTemplate } from "../templates/editCard.template.js";

const generateFanartList = () => {
  const fanartList = document.getElementById("fanartList");

  const success = (request) => {
    fanartList.classList.remove("loading");

    const fanarts = JSON.parse(request.response);

    for (let i = 0; i < fanarts.length; i++) {
      const fanartData = fanarts[i],
        submittedOn = new Date(fanartData.submittedOn).toLocaleDateString(),
        fanartCard = renderTemplate(
          editCardTemplate({
            accentImage: {
              class: "accent-image",
              src: fanartData.image,
            },
            cardBody: [
              {
                class: "title-edit",
                children: [
                  new e.H2(fanartData.title),
                  {
                    class: "edit",
                    child: new c.BTN({
                      children: [
                        new c.ICON("eye"),
                        new e.SPAN({
                          class: "text",
                          textContent: "View",
                        }),
                      ],
                      "data-modal": "_" + fanartData._id,
                    }),
                  },
                ],
              },
              {
                class: "preview",
                children: [
                  new e.P([
                    `${submittedOn} | ${fanartData.artist} | `,
                    new e.SPAN({
                      textContent: fanartData.approved
                        ? "Approved"
                        : "Pending Approval",
                      "data-bind": `approveStatus-${fanartData._id}`,
                    }),
                  ]),
                ],
              },
            ],
            mainModal: {
              modalBody: {
                class: "fanart-modal",
                children: [
                  new e.H2(fanartData.title),
                  new e.P(`By ${fanartData.artist}`),
                  new e.P(fanartData.email),
                  new e.P(`Submitted on ${submittedOn}`),
                  new e.P(`Tags: ${fanartData.tags}`),
                  new e.P(`Description: ${fanartData.description}`),
                  new e.A({
                    href: fanartData.url,
                    target: "_blank",
                    textContent: fanartData.url,
                  }),
                  new e.IMG({
                    src: fanartData.image,
                    alt: fanartData.title,
                  }),
                  TOGGLESINGLE({
                    name: "approved",
                    id: `approve-${fanartData._id}`,
                    label: "Approved",
                    checked: fanartData.approved,
                    // "data-bind": `approveStatus-${fanartData._id}`,
                    // "data-bind-to": "checked",
                    // "data-bind-eq": "Approved",
                  }),
                  twoStepDeleteTemplate({
                    path: "/periodic/admin/fanart/delete",
                    id: fanartData._id,
                  }),
                ],
              },
              id: `_${fanartData._id}`,
            },
          })
        );

      fanartList.appendChild(fanartCard);
    }
  };

  xhr({ path: "/periodic/admin/fanart/retrieve", success });

  return fanartList;
};

generateFanartList();

const approveFanart = (checkbox) => {
  const id = checkbox.id.split("-")[1],
    approved = checkbox.checked;

  const success = () => {
    dataBind("approveStatus-" + id, approved ? "Approved" : "Pending Approval");
  };

  xhr({
    path: "/periodic/admin/fanart/approve",
    body: { id, approved },
    success,
  });
};

addEventDelegate("change", "input[name='approved']", approveFanart);
