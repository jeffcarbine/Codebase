import { editCardTemplate } from "../templates/editCard.template.js";
import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "/periodic/modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

// request episodes from the show

const retrieveEpisodes = () => {
  const success = (request) => {
    const episodesData = JSON.parse(request.response),
      episodes = document.querySelector("#episodes");

    episodes.classList.remove("loading");

    episodesData.forEach((episodeData) => {
      const episode = renderTemplate(
        editCardTemplate({
          cardBody: [
            {
              class: "title-edit",
              children: [
                new e.H2(episodeData.title),
                {
                  class: "edit",
                  child: new c.BTN({
                    "data-modal": `edit${episodeData._id}`,
                    children: [new c.ICON("eye"), new e.SPAN("Edit")],
                  }),
                },
              ],
            },
          ],
          mainModal: {
            id: `edit${episodeData._id}`,
            modalBody: {
              children: [
                new e.H2(`Edit ${episodeData.title}`),
                new e.FORM({
                  action: "/periodic/admin/shows/episode/edit",
                  class: "editEpisode",
                  children: [
                    new e.HIDDEN({ name: "episodeId", value: episodeData._id }),
                    new c.FIELD({
                      name: "transcript",
                      label: "Transcript",
                      value: episodeData.transcript,
                      type: "file",
                    }),
                    new c.BTN({
                      textContent: "Update Episode",
                    }),
                  ],
                }),
              ],
            },
          },
        })
      );

      episodes.prepend(episode);
    });
  };

  xhr({
    path: "/periodic/admin/shows/episodes/retrieve",
    body: { showId },
    success,
  });
};

retrieveEpisodes();

const submitEditEpisode = (form) => {
  xhrForm({ form });
};

addEventDelegate("submit", "form.editEpisode", submitEditEpisode, true);
