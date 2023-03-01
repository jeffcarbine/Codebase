import * as e from "../../template/elements.js";

export const base = (data, template, scripts) => {
  const html = {
    title: "Backstage by Carbine Co.",
    stylesheets: ["/backstage/styles/backstage.min.css"],
    metas: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    body: [
      new e.HEADER({
        if: data.loggedIn,
        id: "mainHeader",
        children: [
          {
            class: "branding",
            children: [
              {
                class: "logo",
                child: new e.IMG("/backstage/images/logo.svg"),
              },
              new e.SPAN("x"),
              {
                class: "client-logo",
                child: new e.IMG("/images/logo-backstage.svg"),
              },
            ],
          },
          new e.NAVIGATION({
            if: data.loggedIn,
            routes: {
              Home: "/backstage",
              Podcasts: "/backstage/podcasts",
              Events: "/backstage/events",
              Fanart: "/backstage/fanart",
            },
          }),
        ],
      }),
      new e.MAIN(template || {}),
      new e.FOOTER({
        if: data.loggedIn,
        children: [
          new e.P(
            "Backstage by Carbine Co. - Copyright " + new Date().getFullYear()
          ),
        ],
      }),
      new e.MODULE({
        src: "/scripts/backstage.js",
      }),
      new e.MODULE({
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

  return new e.HTML(html);
};
