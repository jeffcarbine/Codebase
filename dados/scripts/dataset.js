import { card } from "/periodic/components/card/card.template.js";
import { initModals } from "/periodic/components/modal/modal.js";
import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "/periodic/scripts/xhr/_xhr.js";
import { renderTemplate } from "/periodic/template/_renderTemplate.js";
import * as e from "/periodic/elements/elements.js";

initModals();

const datapointIds = JSON.parse(
  decodeURIComponent(import.meta.url.split("?")[1])
);

const fetchDatapoints = (datapointIds) => {
  const datapointsArea = document.querySelector("#datapoints");
  datapointsArea.innerHTML = "";
  datapointsArea.classList.add("loading");

  const success = (request) => {
    datapointsArea.classList.remove("loading");

    const datapoints = JSON.parse(request.response);

    datapoints.forEach((datapoint) => {
      console.log(datapoint);
      const datapointCard = renderTemplate(
        card({
          children: [
            new e.H2(datapoint.name),
            new e.BTNCONTAINER({ textContent: "Edit" }),
          ],
        })
      );

      datapointsArea.appendChild(datapointCard);
    });
  };

  xhr({
    path: "/admin/datapoints/retrieve",
    body: datapointIds,
    callbacks: { success },
  });
};

fetchDatapoints(datapointIds);

const submitEditDatasets = (form) => {
  const formSuccess = (response) => {
    window.location.reload();
  };

  xhrForm({ form, formSuccess });
};

addEventDelegate("submit", "#addEditDataset", submitEditDatasets, true);

const submitAddDatapoint = (form) => {
  const modal = form.closest("dialog");

  const formSuccess = (response) => {
    modal.close();
    const datapointIds = JSON.parse(response);

    fetchDatapoints(datapointIds);
  };

  xhrForm({ form, formSuccess });
};

addEventDelegate("submit", ".datapointForm", submitAddDatapoint, true);
