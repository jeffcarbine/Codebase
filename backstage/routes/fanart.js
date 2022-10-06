import { get_admin_route } from "../../../modules/get_route.js";
import Fanart from "../../../models/Fanart.js";

export const fanart = (req, res, next) => {
  get_admin_route(req, res, next, (mainCallback) => {
    // get data for the dashbaord

    Fanart.find({}).exec((err, prints) => {
      mainCallback("fanart", { prints, path: "/admin/fanart" });
    });
  });
};
