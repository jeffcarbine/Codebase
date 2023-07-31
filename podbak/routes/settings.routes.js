import { rez } from "../modules/rez.js";

export const get__admin_settings = (req, res) => {
  rez({
    req,
    res,
    template: "settings",
    data: { subtitle: "Settings", path: "/admin/settings" },
  });
};
