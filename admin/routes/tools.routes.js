import MerchClubData from "../../models/MerchClubData.js";
import emailValidator from "email-validator";
import parsePhoneNumber from "libphonenumber-js";
import { rez } from "../modules/rez.js";

export const get__admin_tools = (req, res) => {
  rez({
    req,
    res,
    template: "tools",
    data: { subtitle: "Tools", path: "/periodic/admin/tools" },
  });
};

export const post__admin_tools_merchClubCSV = (req, res) => {
  const body = req.body,
    emailList = body.emailList;

  console.log(emailList);

  // we only accept the request if thephone number and email are valid
  if (emailList !== null && emailList !== undefined && emailList.length > 0) {
    // very simple, we just look for the user in the db by email, update their cut/size as submitted, and upsert if new
    MerchClubData.find({
      email: {
        $in: emailList,
      },
    }).exec(function (err, entries) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        // send back the entries
        return res.status(200).send(entries);
      }
    });
  } else {
    let invalid = [];

    if (emailList.length === 0) {
      invalid.push("email list");
    }

    let message = "The ";

    if (invalid.length === 1) {
      message = message + invalid[0] + " is invalid.";
    } else if (invalid.length === 2) {
      message = message + invalid[0] + " and " + invalid[1] + " are invalid.";
    } else {
      for (var i = 0; i < invalid.length; i++) {
        message += invalid[i] + " ";

        if (i === invalid.length - 2) {
          message += "and ";
        } else if (i === invalid.length - 1) {
          message += "";
        } else {
          message += ", ";
        }
      }

      message += " are invalid.";
    }

    message += " Please try again.";

    return res.status(500).send(message);
  }
};
