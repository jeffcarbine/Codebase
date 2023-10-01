import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export const base = (data, template, scripts) => {
  const generateAdminRoutes = () => {
    if (data.loggedIn) {
      const appRoutes = {
        routes: {
          // Dashboard: [
          //   "/periodic/admin",
          //   new e.SPAN("Dashboard"),
          //   new c.ICON("dashboard"),
          // ],
          Pages: [
            "/periodic/admin/pages",
            new e.SPAN("Pages"),
            new c.ICON("page"),
          ],
          Global: [
            "/periodic/admin/global",
            new e.SPAN("Global"),
            new c.ICON("globe"),
          ],
          Files: [
            "/periodic/admin/files",
            new e.SPAN("Files"),
            new c.ICON("file"),
          ],
          Shows: [
            "/periodic/admin/shows",
            new e.SPAN("Shows"),
            new c.ICON("rss"),
          ],
          Tools: [
            "/periodic/admin/tools",
            new e.SPAN("Tools"),
            new c.ICON("tools"),
          ],
          // Settings: [
          //   "/periodic/admin/settings",
          //   new e.SPAN("Settings"),
          //   new c.ICON("settings"),
          // ],
          // History: ["/periodic/admin/history", "History", new c.ICON("history")],
          // Account: ["/periodic/admin/account", "Account", new c.ICON("user")],
        },
        basePath: "/periodic/admin",
        path: data.path,
      };

      if (data.features.fanart) {
        appRoutes.routes.Fanart = [
          "/periodic/admin/fanart",
          new e.SPAN("Fanart"),
          new c.ICON("image"),
        ];
      }

      if (data.features.events) {
        appRoutes.routes.Events = [
          "/periodic/admin/events",
          new e.SPAN("Events"),
          new c.ICON("calendar"),
        ];
      }

      return appRoutes;
    } else {
      return {};
    }
  };

  const html = {
    title: "Podsyte",
    stylesheets: ["/periodic/admin/styles/admin.min.css"],
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
              // {
              //   class: "logo admin",
              //   child: new e.IMG("/periodic/admin/images/logo.svg"),
              // },
              // new e.SPAN({
              //   class: "x",
              //   textContent: "x",
              // }),
              {
                class: "logo client",
                child: new e.A({
                  href: "/",
                  target: "blank",
                  child: new e.IMG("/images/logo-admin.webp"),
                }),
              },
            ],
          },
          new c.NAVTOGGLE([new e.SPAN(), new e.SPAN(), new e.SPAN()]),
          new e.NAVIGATION(generateAdminRoutes()),
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
              src: "/periodic/admin/images/logo-full.svg",
              alt: "Podsyte",
            }),
          },
          new e.P("&copy; " + new Date().getFullYear() + " MCPVX, LLC"),
        ],
      }),
      new e.MODULE({
        src: "/periodic/admin/scripts/base.js",
      }),
      new e.MODULE({
        src: "/periodic/components/component-loader.js",
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
