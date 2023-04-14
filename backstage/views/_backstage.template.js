import * as e from "../../elements/elements.js";

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
        children: [
          {
            class: "branding",
            children: [
              {
                class: "logo",
                child: new e.IMG("/backstage/images/logo.svg"),
              },
              new e.SPAN({
                class: "x",
                textContent: "x",
              }),
              {
                class: "logo client",
                child: new e.IMG("/images/logo-backstage.svg"),
              },
            ],
          },
          new e.NAVTOGGLE([new e.SPAN(), new e.SPAN(), new e.SPAN()]),
          new e.NAVIGATION({
            if: data.loggedIn,
            routes: {
              Dashboard: ["/backstage", "Dashboard", new e.ICON("dashboard")],
              Pages: ["/backstage/pages", "Pages", new e.ICON("catalog")],
              Widgets: [
                "/backstage/widgets/",
                "Widgets",
                new e.ICON("components"),
              ],
              Podcasts: ["/backstage/shows", "Shows", new e.ICON("podcast")],
              Events: ["/backstage/events", "Events", new e.ICON("calendar")],
              Fanart: ["/backstage/fanart", "Fanart", new e.ICON("image")],
              Account: ["/backstage/account", "Account", new e.ICON("user")],
            },
            path: data.path,
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
        src: "/backstage/scripts/base.js",
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

      html.body.push(script);
    }
  }

  return new e.HTML(html);
};
