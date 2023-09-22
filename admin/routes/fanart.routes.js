import Fanart from "../models/Fanart.js";
import { rez } from "../modules/rez.js";

export const post__admin_fanart_retrieve = (req, res, next) => {
  Fanart.find().exec((err, fanarts) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // sort the fanart by submission date
      fanarts.sort(function (a, b) {
        return new Date(b.submittedOn) - new Date(a.submittedOn);
      });

      return res.status(200).send(fanarts);
    }
  });
};

export const post__admin_fanart_approve = (req, res, next) => {
  const body = req.body,
    _id = body.id,
    approved = body.approved;

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

export const post__admin_fanart_delete = (req, res, next) => {
  const body = req.body,
    _id = body.id;

  console.log("trying to delete!");

  Fanart.findOneAndDelete({
    _id,
  }).exec((err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send();
    }
  });
};
