import { get_admin_route } from "../../../modules/get_route.js";
import Fanart from "../../../models/Fanart.js";

export const fanart = (req, res, next) => {
  // get data for the dashbaord

  Fanart.find({}).exec((err, prints) => {
    res.render("fanart", { prints, path: "/admin/fanart" });
  });
};

export const post__fanartApprove = (req, res, next) => {
  const body = req.body,
    _id = body.hidden.id,
    approved = body.data.approved;

  Fanart.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: {
        approved,
      },
    }
  ).exec((err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send();
    }
  });
};
