import MerchClubData from "../../models/MerchClubData.js";
import emailValidator from "email-validator";
import parsePhoneNumber from "libphonenumber-js";
import { rez } from "../modules/rez.js";
import Member from "../models/Member.js";

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
    year = parseInt(body.year),
    quarter = parseInt(body.quarter),
    yearQuarter = {
      year,
      quarter,
    };

  console.log(yearQuarter);

  // find all the matching entries
  Member.find({
    merchClubMemberships: {
      $in: yearQuarter,
    },
  }).exec((err, members) => {
    // filter out any members that don't have a valid address
    members = members.filter((member) => {
      return (
        member.address.city !== null &&
        member.address.city !== undefined &&
        member.address.city !== ""
      );
    });

    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(members);
    }
  });

  // const body = req.body,
  //   emailList = body.emailList;

  // console.log(emailList);

  // // we only accept the request if thephone number and email are valid
  // if (emailList !== null && emailList !== undefined && emailList.length > 0) {
  //   // very simple, we just look for the user in the db by email, update their cut/size as submitted, and upsert if new
  //   MerchClubData.find({
  //     email: {
  //       $in: emailList,
  //     },
  //   }).exec(function (err, entries) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send(err);
  //     } else {
  //       // send back the entries
  //       return res.status(200).send(entries);
  //     }
  //   });
  // } else {
  //   let invalid = [];

  //   if (emailList.length === 0) {
  //     invalid.push("email list");
  //   }

  //   let message = "The ";

  //   if (invalid.length === 1) {
  //     message = message + invalid[0] + " is invalid.";
  //   } else if (invalid.length === 2) {
  //     message = message + invalid[0] + " and " + invalid[1] + " are invalid.";
  //   } else {
  //     for (var i = 0; i < invalid.length; i++) {
  //       message += invalid[i] + " ";

  //       if (i === invalid.length - 2) {
  //         message += "and ";
  //       } else if (i === invalid.length - 1) {
  //         message += "";
  //       } else {
  //         message += ", ";
  //       }
  //     }

  //     message += " are invalid.";
  //   }

  //   message += " Please try again.";

  //   return res.status(500).send(message);
  // }
};
