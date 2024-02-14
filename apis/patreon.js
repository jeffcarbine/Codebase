/**
 * Environment Variables
 */
import * as dotenv from "dotenv";
dotenv.config();

import Token from "../models/Token.js";
import request from "request";
import async from "async";
import User from "../../premmio/models/User.js";

// const generatePatreonOAuthUrl = (clientId, redirectUri) => {
//   const scopes = [
//     "identity",
//     "identity%5Bemail%5D",
//     "identity.memberships",
//     "campaigns",
//     "campaigns.members",
//     "campaigns.posts",
//     "members",
//     "members%5Bemail%5D",
//     "members.address",
//     "members.campaign",
//     "projects",
//     "webhooks",
//     "notifications",
//   ];
//   const baseUrl = "https://www.patreon.com/oauth2/authorize";
//   const params = new URLSearchParams({
//     response_type: "code",
//     client_id: clientId,
//     redirect_uri: redirectUri,
//     scope: scopes.join(" "),
//   });

//   return `${baseUrl}?${params.toString().replace(/\+/g, "%20")}`;
// };

const patreonClientId = process.env.PATREONCLIENTID,
  patreonRedirectUri = process.env.PATREONREDIRECTURI,
  patreonClientSecret = process.env.PATREONCLIENTSECRET,
  patreonOneTimeCode = process.env.PATREONONETIMECODE;

export const patreonOauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${patreonClientId}&redirect_uri=${patreonRedirectUri}&scope=identity%20identity%5Bemail%5D%20identity.memberships%20campaigns%20campaigns.members%20campaigns.posts%20campaigns.members%20campaigns.members%5Bemail%5D`;

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

export const generateNewPatreonToken = ({
  oneTimeCode = patreonOneTimeCode,
  tokenName,
  callback,
  mainCallback,
} = {}) => {
  console.log("Generating new Patreon token");
  request.post(
    {
      url: `https://www.patreon.com/api/oauth2/token?code=${oneTimeCode}&grant_type=authorization_code&client_id=${patreonClientId}&client_secret=${patreonClientSecret}&redirect_uri=${patreonRedirectUri}`,
      headers: "Content-Type: application/x-www-form-urlencoded",
    },
    (err, httpResponse, str) => {
      if (err) {
        callback(err);
      } else {
        let body = JSON.parse(str);

        if (body.access_token) {
          console.log("Successfully generated Patreon token");

          if (tokenName) {
            return saveAndReturnPatreonToken(
              tokenName,
              body.access_token,
              body.refresh_token,
              body.expires_in,
              callback,
              mainCallback
            );
          } else {
            // we need to save this token to a user, so we need to get
            // their info from Patreon
            request.get(
              {
                url: "https://www.patreon.com/api/oauth2/api/current_user",
                headers: {
                  Authorization: `Bearer ${body.access_token}`,
                },
              },
              (err, httpResponse, str) => {
                if (err) {
                  callback(err);
                } else {
                  let patreonUser = JSON.parse(str);

                  const getPledgeData = (user) => {
                    // loop throug the patreon user's included data
                    // and format it into an array of pledges
                    const pledges = [];

                    for (let i = 0; i < patreonUser.included.length; i++) {
                      const inclusion = patreonUser.included[i];
                      if (
                        inclusion.type === "reward" &&
                        inclusion.relationships !== undefined
                      ) {
                        console.log(JSON.stringify(inclusion));
                        const campaign_id =
                            inclusion.relationships.campaign.data.id,
                          pledge = inclusion.attributes.amount_cents;

                        pledges.push({
                          campaign_id,
                          pledge,
                        });
                      }
                    }

                    return pledges;
                  };

                  // check to see if we have a user with this patreon id
                  // if so, update their token inf
                  // if not, register a new user
                  User.findOne({
                    "patreon.id": patreonUser.data.id,
                  }).exec((err, user) => {
                    if (user) {
                      user.patreon.access_token = body.access_token;
                      user.patreon.refresh_token = body.refresh_token;
                      user.patreon.expires =
                        new Date().getTime() + body.expires_in * 1000;
                      user.patreon_pledges = getPledgeData(patreonUser);

                      user.save((err, updatedUser) => {
                        mainCallback(err, updatedUser);
                      });
                    } else {
                      const username = patreonUser.data.attributes.email,
                        password = patreonUser.data.id;

                      User.register(
                        {
                          username,
                          firstName: patreonUser.data.attributes.first_name,
                          createdAt: new Date(),
                          "patreon.id": patreonUser.data.id,
                          "patreon.access_token": body.access_token,
                          "patreon.refresh_token": body.refresh_token,
                          "patreon.expires_in":
                            new Date().getTime() + body.expires_in * 1000,
                          patreon_pledges: getPledgeData(patreonUser),
                        },
                        password,
                        (err, newUser) => {
                          mainCallback(err, newUser);
                        }
                      );
                    }
                  });
                }
              }
            );
          }
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
              // check to see if we have a one-time code
              if (patreonOneTimeCode) {
                console.log("No Patreon token found, requesting new one");
                generateNewPatreonToken(tokenName, callback, mainCallback);
              } else {
                if (
                  !patreonClientId ||
                  !patreonClientSecret ||
                  !patreonRedirectUri
                ) {
                  mainCallback(
                    "No Patreon client ID, client secret, or redirect URI found. Please correct this in your environment variables."
                  );
                } else {
                  mainCallback(`No Patreon one-time code found in environment variables. Please generate one at ${patreonOauthUrl}
                  `);
                }
              }
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
