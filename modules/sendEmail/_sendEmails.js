import * as dotenv from "dotenv";
dotenv.config();

import async from "async";
import nodemailer from "nodemailer";
import * as fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAILADDRESS,
    pass: process.env.EMAILPASSWORD,
  },
});

/**
 * sends an email
 * @param {string} template full path to the html template to render
 * @param {string} recipient who the email is going to
 * @param {string} subject the subject of the email
 * @param {string} message text-only version of the email
 * @param {object} replacements key/value pairs of %%data%% replacements in template file
 * @param {string} mainCallback a passed callback, if needed
 */
export const sendEmail = (obj) => {
  // set object defaults
  const template = obj.template,
    to = obj.to !== undefined ? obj.to : process.env.EMAILADDRESS,
    subject =
      obj.subject !== undefined
        ? obj.subject
        : "You received a message from your Carbine.co website",
    message =
      obj.message !== undefined
        ? obj.message
        : "Somebody has submitted a contact form on your website.",
    replacements = obj.replacements !== undefined ? obj.replacements : false,
    res = obj.res !== undefined ? obj.res : false,
    successMessage =
      obj.successMessage !== undefined
        ? obj.successMessage
        : "Email sent successfully";

  async.waterfall(
    [
      // step 1: get the template base html file
      (callback) => {
        fs.readFile(__dirname + "/email-templates/base.html", "utf8", function (err, html) {
          if (err) {
            callback(err);
          } else {
            // set the html to a variable
            let base = html;

            callback(null, base);
          }
        });
      },
      // step 1: get the template's html from file
      function (base, callback) {
        if (replacements) {
          fs.readFile(__dirname + template, "utf8", function (err, html) {
            if (err) {
              callback(err);
            } else {
              // set the html to a variable
              let htmlBody = html;

              // place the htmlBody into the base
              base = base.replace("%%templateBody%%", htmlBody);

              // and then process the replacements
              for (let key in replacements) {
                let replacement = replacements[key];

                base = base.replace("%%" + key + "%%", replacement);
              }

              // and send the modified htmlBody on to the next step
              callback(null, base);
            }
          });
        } else {
          callback(null, null);
        }
      },
      function (htmlBody, callback) {
        // create the emailData object
        const emailData = {
          from: process.env.EMAILADDRESS,
          to, // list of recipients
          subject: subject, // Subject line
          text: message, // plain text body
        };

        if (htmlBody !== null) {
          emailData.html = htmlBody;
        }

        // send the email
        transporter
          .sendMail(emailData)
          .then(() => {
            // and return a 200 if response was provided
            if (res) {
              return res.status(200).send(successMessage);
            }
          })
          .catch((err) => {
            callback(err);
          });
      },
    ],
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
};

/**
 * Send Gift Card Email
 *
 * A speficied version for sendEmail that also updates
 * the corresponding Gift Card's data in the database
 */

export const sendGiftCardEmail = (
  gans,
  template,
  recipient,
  subject,
  message,
  replacements,
  emailValue
) => {
  async.waterfall(
    [
      // step 1: send email
      function (callback) {
        sendEmail(
          template,
          recipient,
          subject,
          message,
          replacements,
          callback
        );
      },
      // step 2: update database
      function (callback) {
        // object for assigning the emailSent value
        const updateObject = {
          emailsSent: {},
        };

        // add the boolean to the appropriate key
        updateObject.emailsSent[emailValue] = true;

        // and find the gift card and update it
        for (let i = 0; i < gans.length; i++) {
          const gan = gans[i];

          GiftCard.findOneAndUpdate(
            {
              gan,
            },
            {
              $set: updateObject,
            }
          ).exec((giftCard, err) => {
            if (err) {
              callback(err);
            } else {
              // win
              console.log(
                "Successfully updated Gift Card's email status in database"
              );
            }
          });
        }
      },
    ],
    function (err) {
      console.log(err);
    }
  );
};
