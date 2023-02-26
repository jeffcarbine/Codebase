import * as dotenv from "dotenv";
dotenv.config();

import async from "async";
import Token from "../models/Token.js";
import request from "request";

// use this url to generate the access_token
// https://accounts.spotify.com/en/authorize?response_type=code&client_id=<CLIENTID>&redirect_uri=https://carbine.co

const spotify_client_id = process.env.SPOTIFYCLIENTID,
  spotify_client_secret = process.env.SPOTIFYCLIENTSECRET,
  spotify_access_code = process.env.SPOTIFYACCESSCODE;

const generateSpotifyToken = () => {
  request.post(
    {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
            "base64"
          ),
      },
      form: {
        code: spotify_access_code,
        redirect_uri: "https://carbine.co",
        grant_type: "authorization_code",
      },
    },
    function (err, httpResponse, str) {
      if (err) {
        console.log(err);
      } else {
        const body = JSON.parse(str),
          expires = new Date();

        expires.setHours(expires.getHours() + 1);

        Token.findOneAndUpdate(
          {
            name: "spotify",
          },
          {
            $set: {
              name: "spotify",
              access_token: body.access_token,
              refresh_token: body.refresh_token,
              expires,
            },
          },
          {
            upsert: true,
          }
        ).exec((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Succesfully generated Token for Spotify");
          }
        });
      }
    }
  );
};

export function getSpotifyToken(mainCallback) {
  const now = new Date();

  // first, attempt to get the token from the databsae
  Token.findOne({
    name: "spotify",
  }).exec(function (err, token) {
    if (err) {
      callback(err);
    } else {
      // if the token is still valid, use it
      if (token !== null && token.expires > now) {
        console.log("spotify token still valid!");
        mainCallback(token.access_token);
      } else {
        // if the token is null, we don't have one so we need to generate a token
        if (token === null) {
          console.log("No Spotify token found. Generating one.");
          generateSpotifyToken();
        } else {
          console.log("spotify token invalid, time for a new one");
          // otherwise, let's get a new token
          refreshSpotifyToken(token, mainCallback);
        }
      }
    }
  });

  const refreshSpotifyToken = (token, mainCallback) => {
    const refresh_token = token.refresh_token;

    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              spotify_client_id + ":" + spotify_client_secret
            ).toString("base64"),
        },
        form: {
          grant_type: "refresh_token",
          refresh_token,
        },
      },
      (err, httpResponse, str) => {
        if (err) {
          console.log(err);
        } else {
          let body = JSON.parse(str);
          console.log(body);

          token.access_token = body.access_token;
          token.expires = now.setHours(now.getHours() + 1);
          token.save();

          mainCallback(body.access_token);
        }
      }
    );
  };

  // async.waterfall(
  //   [
  //     // step 1: get refreh_token from database
  //     function (callback) {
  //       Token.findOne({
  //         name: "spotify",
  //       }).exec(function (err, token) {
  //         if (err) {
  //           callback(err);
  //         } else {
  //           // if the token is still valid, use it
  //           if (token == null && token.expires > now) {
  //             console.log("spotify token still valid!");
  //             mainCallback(token.access_token);
  //           } else {
  //             console.log("spotify token invalid, time for a new one");
  //             // otherwise, let's get a new token
  //             callback(null, token);
  //           }
  //         }
  //       });
  //     },
  //     // step 2: retrieve access_token from spotify
  //     function (token, callback) {
  //       request.post(
  //         {
  //           url: "https://accounts.spotify.com/api/token",
  //           headers: {
  //             Authorization:
  //               "Basic " +
  //               Buffer.from(
  //                 spotify_client_id + ":" + spotify_client_secret
  //               ).toString("base64"),
  //           },
  //           form: {
  //             grant_type: "refresh_token",
  //             refresh_token: token.refresh_token,
  //           },
  //         },
  //         function (err, httpResponse, str) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             let body = JSON.parse(str);
  //             console.log(body);

  //             token.access_token = body.access_token;
  //             token.expires = now.setHours(now.getHours() + 1);
  //             token.save();

  //             mainCallback(body.access_token);
  //           }
  //         }
  //       );
  //     },
  //   ],
  //   function (err) {
  //     if (err) {
  //       return err;
  //     }
  //   }
  // );
}
