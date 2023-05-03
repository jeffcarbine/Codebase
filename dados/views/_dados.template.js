import * as e from "../../elements/elements.js";

export const base = (data, template, scripts) => {
  const html = {
    title: "dados by Carbine Co.",
    stylesheets: ["/admin/styles/dados.min.css"],
    metas: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    body: [
      new e.SCRIPT({
        textContent: "0",
      }),
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
              Global: ["/admin/global", "Global", new e.ICON("globe")],
              Pages: ["/admin/pages", "Pages", new e.ICON("webpage")],
              //Data: ["/admin/datasets", "Datasets", new e.ICON("data")],
              Podcasts: ["/admin/shows", "Podcasts", new e.ICON("podcast")],
              //Events: ["/admin/events", "Events", new e.ICON("calendar")],
              // Fanart: ["/admin/fanart", "Fanart", new e.ICON("image")],
              History: ["/admin/history", "History", new e.ICON("history")],
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
            "Dados by Carbine Co. - Copyright " + new Date().getFullYear()
          ),
        ],
      }),
      new e.MODULE({
        src: "/admin/scripts/base.js",
      }),
      new e.MODULE({
        src: "/periodic/elements/input/input.js",
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
