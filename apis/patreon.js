/**
 * Environment Variables
 */
import * as dotenv from "dotenv";
dotenv.config();

import Token from "../models/Token.js";
import request from "request";
import async from "async";

// https://www.patreon.com/oauth2/authorize?response_type=code&client_id=VFwd4Mix4Vce-cqXqKYEMjrHiSeD3UAEOZ4U3ssfRwZ33RyaysQ3KsMh9d6iv2gC&redirect_uri=https://carbine.co&scope=identity%20identity%5Bemail%5D%20campaigns%20campaigns.posts%20campaigns.members%20campaigns.members%5Bemail%5D&fields%5Bmembers%5D=last_charge_date

const patreonClientId = process.env.PATREONCLIENTID,
  patreonClientSecret = process.env.PATREONCLIENTSECRET,
  patreonOneTimeCode = process.env.PATREONONETIMECODE;

const saveAndReturnPatreonToken = (
  tokenName,
  access_token,
  refresh_token,
  expires_in,
  callback,
  mainCallback
) => {
  // create new expiration date
  const now = new Date().getTime(),
    expires = now + expires_in * 1000;

  Token.findOneAndUpdate(
    {
      name: tokenName,
    },
    {
      $set: {
        access_token,
        refresh_token,
        expires,
      },
    },
    {
      upsert: true,
      new: true,
    }
  ).exec((err, token) => {
    if (err) {
      callback(err);
    } else {
      mainCallback(null, token.access_token);
    }
  });
};

export const generateNewPatreonToken = (tokenName, callback, mainCallback) => {
  request.post(
    {
      url: `https://www.patreon.com/api/oauth2/token?code=${patreonOneTimeCode}&grant_type=authorization_code&client_id=${patreonClientId}&client_secret=${patreonClientSecret}&redirect_uri=https://carbine.co`,
      headers: "Content-Type: application/x-www-form-urlencoded",
    },
    (err, httpResponse, str) => {
      if (err) {
        callback(err);
      } else {
        let body = JSON.parse(str);

        if (body.access_token) {
          console.log("Successfully generated Patreon token");
          return saveAndReturnPatreonToken(
            tokenName,
            body.access_token,
            body.refresh_token,
            body.expires_in,
            callback,
            mainCallback
          );
        } else {
          console.log("Error generating Patreon token:");
          console.log(body);
        }
      }
    }
  );
};

export const getPatreonToken = (mainCallback, tokenName = "patreon") => {
  async.waterfall(
    [
      // step 1: get token from database
      (callback) => {
        Token.findOne({
          name: tokenName,
        }).exec((err, token) => {
          if (err) {
            callback(err);
          } else {
            if (token === null) {
              console.log("No Patreon token found, requesting new one");
              generateNewPatreonToken(tokenName, callback, mainCallback);
            } else {
              // check expiration
              let now = new Date().getTime();

              if (now > token.expires) {
                console.log("Patreon token invalid, requesting new one");
                // then we need to refresh
                callback(null, token.refresh_token);
              } else {
                console.log("Patreon token still valid!");
                // we can return the token now
                mainCallback(null, token.access_token);
              }
            }
          }
        });
      },
      // step 2: refresh token with patreon
      (refresh_token, callback) => {
        request.post(
          {
            url:
              "https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=" +
              refresh_token +
              "&client_id=" +
              patreonClientId +
              "&client_secret=" +
              patreonClientSecret,
          },
          function (err, httpResponse, str) {
            if (err) {
              callback(err);
            } else {
              let body = JSON.parse(str);

              callback(
                null,
                body.access_token,
                body.refresh_token,
                body.expires_in
              );
            }
          }
        );
      },
      // step 3: update the token in the database
      (access_token, refresh_token, expires_in, callback) => {
        saveAndReturnPatreonToken(
          tokenName,
          access_token,
          refresh_token,
          expires_in,
          callback,
          mainCallback
        );
      },
    ],
    function (err) {
      if (err) {
        console.error(err);
      }
    }
  );
};
