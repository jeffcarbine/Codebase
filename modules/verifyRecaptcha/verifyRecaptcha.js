import request from "request";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.RECAPTCHASECRET;

export const verifyRecaptcha = (response, callback) => {
  // send recaptchaResponse to Google
  request.post(
    {
      url:
        "https://www.google.com/recaptcha/api/siteverify?secret=" +
        secret +
        "&response=" +
        response,
    },
    (err, httpResponse, str) => {
      if (err) {
        console.log(err);
      } else {
        const body = JSON.parse(str);
        callback(body);
      }
    }
  );
};
