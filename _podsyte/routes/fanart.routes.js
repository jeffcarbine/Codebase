import Fanart from "../models/Fanart.js";
import { rez } from "../modules/rez.js";

export const get__admin_fanart = (req, res, next) => {
  Fanart.find({}).exec((err, prints) => {
    console.log("got prints");
    console.log(prints);

    return rez({
      req,
      res,
      template: "fanart",
      data: { subtitle: "Fanart", path: "/admin/fanart", prints },
    });
  });
};

export const post__admin_fanart_approve = (req, res, next) => {
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
