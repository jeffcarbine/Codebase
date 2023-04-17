import * as e from "../../elements/elements.js";

export const base = (data, template, scripts) => {
  console.log(data);

  const html = {
    title: "dados by Carbine Co.",
    stylesheets: ["/admin/styles/dados.min.css"],
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
                child: new e.IMG("/admin/images/logo.svg"),
              },
              new e.SPAN({
                class: "x",
                textContent: "x",
              }),
              {
                class: "logo client",
                child: new e.IMG("/images/logo-dados.svg"),
              },
            ],
          },
          new e.NAVTOGGLE([new e.SPAN(), new e.SPAN(), new e.SPAN()]),
          new e.NAVIGATION({
            if: data.loggedIn,
            routes: {
              Dashboard: ["/admin", "Dashboard", new e.ICON("dashboard")],
              Data: ["/admin/datasets", "Datasets", new e.ICON("data")],
              Podcasts: ["/admin/shows", "Shows", new e.ICON("podcast")],
              Events: ["/admin/events", "Events", new e.ICON("calendar")],
              Fanart: ["/admin/fanart", "Fanart", new e.ICON("image")],
              Account: ["/admin/account", "Account", new e.ICON("user")],
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
            "dados by Carbine Co. - Copyright " + new Date().getFullYear()
          ),
        ],
      }),
      new e.MODULE({
        src: "/admin/scripts/base.js",
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
