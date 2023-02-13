import {
  HEADER,
  BODY,
  HTML,
  IMG,
  MAIN,
  HEAD,
  NAVIGATION,
  SCRIPT,
  MODULE,
  STYLESHEET,
  FOOTER,
  P,
  SPAN,
  A,
} from "../../template/elements.js";

export const base = (data, template, scripts) => {
  const html = {
    title: "Backstage by Carbine Co.",
    stylesheets: ["/backstage/styles/backstage.min.css"],
    metas: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    children: [
      new BODY({
        children: [
          new HEADER({
            if: data.loggedIn,
            id: "mainHeader",
            children: [
              {
                class: "logo",
                child: new IMG("/backstage/images/logo.svg"),
              },
              new SPAN("x"),
              {
                class: "client-logo",
                child: new IMG("/images/logo-backstage.svg"),
              },
            ],
          }),
          {
            class: "split",
            children: [
              new NAVIGATION({
                if: data.loggedIn,
                routes: {
                  Home: "/backstage",
                  Podcasts: "/backstage/podcasts",
                  Events: "/backstage/events",
                  Fanart: "/backstage/fanart",
                },
              }),
              new MAIN(template || {}),
            ],
          },
        ],
      }),
      new FOOTER({
        if: data.loggedIn,
        children: [
          new P(
            "Backstage by Carbine Co. - Copyright " + new Date().getFullYear()
          ),
        ],
      }),
      new MODULE({
        src: "/scripts/backstage.js",
      }),
      new MODULE({
        src: "/periodic/elements/input/_input.js",
      }),
    ],
  };

  // add additional scripts
  if (scripts !== undefined && Array.isArray(scripts)) {
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];

      html.children.push(script);
    }
  }

  return new HTML(html);
};
