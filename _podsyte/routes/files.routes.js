import { rez } from "../modules/rez.js";
import File from "../models/File.js";

export const get__admin_files = (req, res) => {
  return rez({
    req,
    res,
    template: "files",
    data: { subtitle: "Files", path: "/admin/files" },
  });
};
