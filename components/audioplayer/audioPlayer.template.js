import { speaker, download } from "../icon/_icon-list.js";

export const audioplayerTemplate = (link, title = "", ifValue = true) => {
  return {
    if: ifValue,
    class: "audio-player",
    children: [
      {
        tagName: "audio",
        controls: true,
        "data-src": link,
      },
      {
        class: "controls",
        children: [
          {
            class: "name",
            textContent: title,
          },
          {
            class: "play-container",
            child: {
              class: "toggle-play play",
            },
          },
          {
            class: "time",
            children: [
              {
                class: "current",
                textContent: "--:--",
              },
              {
                class: "time-spacer",
              },
              {
                class: "length",
                textContent: "--:--",
              },
            ],
          },
          {
            class: "volume-container",
            children: [
              {
                class: "volume-button",
                child: {
                  icon: { speaker },
                },
              },
              {
                class: "volume-slider",
                child: {
                  class: "volume-percentage",
                },
              },
            ],
          },
          // {
          //   class: "download-container",
          //   child: {
          //     tagName: "a",
          //     href: downloadLink || link,
          //     download: title,
          //     class: "download-button",
          //     child: {
          //       icon: { download },
          //     },
          //   },
          // },
        ],
      },
      {
        class: "timeline",
        child: {
          class: "progress",
        },
      },
    ],
  };
};
