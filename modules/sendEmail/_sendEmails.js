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
    user: "concierge@tailorcooperative.com",
    pass: "uhspmxjlcbwidzus",
  },
});

/**
 * sends an email
 * @param {string} template the html template to render
 * @param {string} recipient who the email is going to
 * @param {string} subject the subject of the email
 * @param {string} message text-only version of the email
 * @param {object} replacements key/value pairs of %%data%% replacements in template file
 * @param {string} mainCallback a passed callback, if needed
 */
export const sendEmail = (
  template,
  recipient,
  subject,
  message,
  replacements,
  mainCallback = false
) => {
  console.log("attempting to send email!");
  async.waterfall(
    [
      // step 1: get the template's html from file
      function (callback) {
        fs.readFile(
          __dirname + "/emailTemplates/" + template + ".html",
          "utf8",
          function (err, html) {
            if (err) {
              callback(err);
            } else {
              // set the html to a variable
              let htmlBody = html;

              // and then process the replacements
              for (let key in replacements) {
                let replacement = replacements[key];

                htmlBody = htmlBody.replace("%%" + key + "%%", replacement);
              }

              // and send the modified htmlBody on to the next step
              callback(null, htmlBody);
            }
          }
        );
      },
      function (htmlBody, callback) {
        // send the email
        transporter
          .sendMail({
            from: '"Tailor Cooperative" <concierge@tailorcooperative.com>', // sender address
            to: recipient, // list of recipients
            subject: subject, // Subject line
            text: message, // plain text body
            html: htmlBody, // html body
          })
          .then((info) => {
            // email was successfully sent
            console.log("sent email");

            // and run mainCallback if it exists
            if (mainCallback) {
              mainCallback();
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
