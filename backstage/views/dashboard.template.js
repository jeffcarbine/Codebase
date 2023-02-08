import { base } from "./_base.template.js";
import { SECTION, H1, P, IMG } from "../../template/elements.js";

export default (data) => {
  return base(data, {
    children: [
      new SECTION({
        id: "splash",
        "data-vclass": "animated",
        children: [
          {
            class: "layers sm",
            children: [
              new IMG({
                class: "layer layer2",
                src: "/images/background/layer2-sm.webp",
              }),
              new IMG({
                class: "layer layer3",
                src: "/images/background/layer3-sm.webp",
              }),
              new IMG({
                class: "layer layer4",
                src: "/images/background/layer4-sm.webp",
              }),
              new IMG({
                class: "layer layer5",
                src: "/images/background/layer5-sm.webp",
              }),
              new IMG({
                class: "layer layer56",
                src: "/images/background/layer6-sm.webp",
              }),
            ],
          },
          {
            class: "layers lg",
            children: [
              new IMG({
                class: "layer layer2",
                src: "/images/background/layer2-lg.webp",
              }),
              new IMG({
                class: "layer layer3",
                src: "/images/background/layer3-lg.webp",
              }),
              new IMG({
                class: "layer layer4",
                src: "/images/background/layer4-lg.webp",
              }),
              new IMG({
                class: "layer layer5",
                src: "/images/background/layer5-lg.webp",
              }),
              new IMG({
                class: "layer layer6",
                src: "/images/background/layer6-lg.webp",
              }),
            ],
          },
          {
            id: "latestEpisode",
            children: [new H1("Latest Episode")],
          },
        ],
      }),
      new SECTION({
        id: "discord",
        "data-vclass": "animated",
        children: [new H1("Join Us On Discord")],
      }),
      new SECTION({
        id: "patreon",
        "data-vclass": "animated",
        children: [new H1("Support Us On Patreon")],
      }),
      new SECTION({
        id: "about",
        "data-vclass": "animated",
        children: [new H1("About The Show")],
      }),
      new SECTION({
        id: "contact",
        "data-vclass": "animated",
        children: [new H1("Contact Us")],
      }),
    ],
  });
};
