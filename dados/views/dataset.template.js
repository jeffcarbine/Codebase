import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { capitalize } from "../../scripts/formatString/formatString.js";
import { createEditDatasetTemplate } from "../templates/createEditDataset.template.js";

export default (data) => {
  const datapointForms = {
    text: [
      new e.HIDDEN({ name: "type", value: "text" }),
      new e.LABEL({
        textContent: "Content",
        child: new e.TEXTAREA({ name: "value" }),
      }),
      new e.BTNCONTAINER(["Create Text"], "centered"),
    ],
    event: [
      new e.HIDDEN({ name: "type", value: "event" }),
      new e.TEXT({
        name: "venue",
        label: "Venue",
      }),
      new e.TEXT({
        name: "street",
        label: "Street",
      }),
      new e.TEXT({
        name: "city",
        label: "City",
      }),
      new e.TEXT({
        name: "region",
        label: "Region",
      }),
      new e.TEXT({
        name: "country",
        label: "Country",
      }),
      new e.DATE({
        label: "Show Date",
      }),
      new e.TEXT({
        name: "tickets",
        label: "Tickets",
      }),
      new e.BTNCONTAINER(["Create Event"], "centered"),
    ],
    show: [
      new e.HIDDEN({ name: "type", value: "show" }),
      new e.TEXT({
        name: "title",
        label: "Title",
      }),
      new e.TEXT({
        name: "rss",
        label: "RSS",
      }),
      new e.TEXT({
        name: "patreon",
        label: "Patreon",
      }),
      new e.TEXT({
        name: "spotify",
        label: "Spotify",
      }),
      new e.TEXT({
        name: "youTube",
        label: "YouTube",
      }),
      new e.TEXT({
        name: "apple",
        label: "Apple",
      }),
      new e.BTNCONTAINER(["Create Show"], "centered"),
    ],
  };

  const generateDatapointForm = () => {
    const generateForms = () => {
      const forms = [];

      for (let type in datapointForms) {
        if (!data.dataset.restricted || data.dataset.restrictedTo === type) {
          const datapointForm = [
            new e.HIDDEN({ name: "datasetId", value: data.dataset._id }),
            new e.TEXT("name"),
          ].concat(datapointForms[type]);

          forms.push(
            new e.FORM({
              method: "POST",
              action: "/admin/datapoints/add",
              id: type + "-form",
              class:
                type +
                " datapointForm" +
                (!data.dataset.restricted
                  ? type !== "text"
                    ? " hidden"
                    : ""
                  : ""),
              children: datapointForm,
            })
          );
        }
      }

      return {
        children: forms,
      };
    };

    return {
      class: "style-inputs",
      children: [
        new e.H2(
          "New " +
            (data.dataset.restricted
              ? capitalize(data.dataset.restrictedTo)
              : "Datapoint")
        ),
        new e.LABEL({
          if: !data.dataset.restricted,
          textContent: "Type",
          child: new e.SELECT({
            id: "datasetSelector",
            name: "datasetSelector",
            "data-targets": ".datapointForm",
            children: ["text", "event", "show"],
          }),
        }),
        generateForms(),
      ],
    };
  };

  return base(
    data,
    {
      children: [
        new e.H1([
          new e.ICON("data"),
          new e.A({ href: "/admin/datasets", textContent: "Datasets" }),
          new e.ICON("chevronRight"),
          data.dataset.name,
        ]),
        new e.BTNCONTAINER(
          [
            {
              id: "editDataset",
              "data-modal": "editDatasetModal",
              children: [new e.ICON("edit"), "Edit Dataset"],
            },
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [
                new e.ICON("plus"),
                "Create New " +
                  (data.dataset.restricted
                    ? capitalize(data.dataset.restrictedTo)
                    : "Datapoint"),
              ],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            modalTemplate(
              createEditDatasetTemplate(data.dataset),
              "editDatasetModal"
            ),
            modalTemplate(generateDatapointForm(), "addDatapointModal"),
          ],
        },

        new e.SECTION({
          id: "datapoints",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/_input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE(
        "/admin/scripts/dataset.js?" + JSON.stringify(data.dataset.datapoints)
      ),
    ]
  );
};
