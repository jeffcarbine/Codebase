import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export const base = (data, template, scripts) => {
  const html = {
    title: "Podsyte",
    stylesheets: ["/admin/styles/podsyte.min.css"],
    metas: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    body: [
      new e.SCRIPT({
        textContent: "0",
      }),
      new e.HEADER({
        children: [
          {
            class: "branding",
            children: [
              {
                class: "logo podsyte",
                child: new e.IMG("/admin/images/logo.svg"),
              },
              // new e.SPAN({
              //   class: "x",
              //   textContent: "x",
              // }),
              {
                class: "logo client",
                child: new e.A({
                  href: "/",
                  target: "blank",
                  child: new e.IMG("/images/logo-podsyte.webp"),
                }),
              },
            ],
          },
          new c.NAVTOGGLE([new e.SPAN(), new e.SPAN(), new e.SPAN()]),
          new e.NAVIGATION({
            if: data.loggedIn,
            routes: {
              Dashboard: [
                "/admin",
                new e.SPAN("Dashboard"),
                new c.ICON("dashboard"),
              ],
              Global: [
                "/admin/global",
                new e.SPAN("Global"),
                new c.ICON("globe"),
              ],
              Pages: ["/admin/pages", new e.SPAN("Pages"), new c.ICON("page")],
              Podcasts: [
                "/admin/shows",
                new e.SPAN("Podcasts"),
                new c.ICON("rss"),
              ],
              Events: [
                "/admin/events",
                new e.SPAN("Events"),
                new c.ICON("calendar"),
              ],
              Tools: ["/admin/tools", new e.SPAN("Tools"), new c.ICON("tools")],
              Settings: [
                "/admin/settings",
                new e.SPAN("Settings"),
                new c.ICON("settings"),
              ],
              // Fanart: ["/admin/fanart", "Fanart", new c.ICON("image")],
              // History: ["/admin/history", "History", new c.ICON("history")],
              // Account: ["/admin/account", "Account", new c.ICON("user")],
            },
            basePath: "/admin",
            path: data.path,
          }),
        ],
      }),
      new e.MAIN(template || {}),
      new e.FOOTER({
        if: data.loggedIn,
        children: [
          {
            class: "footer-logo",
            child: new e.IMG({
              class: "logo-full",
              src: "/admin/images/logo-full.svg",
              alt: "Podsyte",
            }),
          },
          new e.P("&copy; " + new Date().getFullYear() + " MCPVX, LLC"),
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
