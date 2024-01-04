import { actionCardTemplate } from "../templates/actionCard.template.js";
import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { twoStepDeleteTemplate } from "/periodic/admin/templates/twoStepDelete.template.js";

const retrieveFiles = () => {
  const fileList = document.querySelector("#fileList");

  fileList.innerHTML = "";
  fileList.classList.add("loading");

  const success = (request) => {
    fileList.classList.remove("loading");

    const files = JSON.parse(request.response);

    files.forEach((file) => {
      const fileCard = renderTemplate(
        actionCardTemplate({
          info: [new e.H2(file.name)],
          actions: [
            new c.BTN({
              "data-copy": file.filepath,
              child: new c.ICON("copy"),
              class: "icon-only",
              "aria-label": "Copy Filepath",
            }),
            twoStepDeleteTemplate({
              path: "/periodic/admin/files/delete",
              id: file._id,
              iconOnly: true,
            }),
          ],
          body: [new e.P(file.filepath)],
        })
      );

      fileList.appendChild(fileCard);
    });
  };

  xhr({ path: "/periodic/admin/files/retrieve", success });
};

retrieveFiles();

const submitFileForm = (form) => {
  const success = () => {
    retrieveFiles();
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "form#addFile", submitFileForm, true);
