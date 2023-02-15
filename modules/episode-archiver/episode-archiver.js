import * as dotenv from "dotenv";
dotenv.config();

import async from "async";
import asyncLoop from "node-async-loop";
import request from "request";
import { getSpotifyToken } from "../../apis/spotify.js";
// import { getPatreonToken } from "../../../apis/patreon.js";
import Episode from "../../../models/Episode.js";
// import { generateTitles } from "../../../modules/episodeFormatter.js";
import pkg from "rss-to-json";
const { parse } = pkg;

const itunesUrl = process.env.ITUNESURL,
  spotifyUrl = process.env.SPOTIFYURL,
  rssUrl = process.env.RSSURL,
  patreonUrl = process.env.PATREONURL;

// the rss feed is the master for the episodes,
// so this is how we generate an episode's entry
// in the database. the other functions only find
// and update an entry with their data, with the
// exception of patreon exclusives
const processRSS = (rssFormatter, count = 1, asyncCallback) => {
  console.log("getting episodes from RSS feed");

  parse(rssUrl).then((feed) => {
    const episodes = feed.items;

    asyncLoop(
      episodes,
      (episode, next) => {
        const formattedEpisode = rssFormatter(episode),
          fullTitle = formattedEpisode.fullTitle;

        // save to mongodb
        Episode.findOneAndUpdate(
          {
            fullTitle,
          },
          {
            $set: formattedEpisode,
          },
          {
            upsert: true,
          }
        ).exec(function (err, episode) {
          if (err) {
            mainCallback(err);
          } else {
            next();
          }
        });
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully updated RSS feed episodes");

          if (asyncCallback) {
            asyncCallback(null);
          }
        }
      }
    );
  });
  // get the number of episodes from the rss feed
  // fetch(rssUrl + count)
  //   // make it json
  //   .then((res) => {
  //     console.log(res);
  //     res.json();
  //   })
  //   // and now extract the data needed for the episode
  //   .then((json) => {
  //     const eps = json.items,
  //       formattedEps = []; // this is just in case we are getting a callback

  //     asyncLoop(
  //       eps,
  //       (ep, next) => {
  //         const formattedEp = rssFormatter(ep),
  //           fullTitle = formattedEp.fullTitle;

  //         // save to mongodb
  //         Episode.findOneAndUpdate(
  //           {
  //             fullTitle,
  //           },
  //           {
  //             $set: formattedEp,
  //           },
  //           {
  //             upsert: true,
  //           }
  //         ).exec(function (err, episode) {
  //           if (err) {
  //             mainCallback(err);
  //           } else {
  //             formattedEps.push(formattedEp);
  //             next();
  //           }
  //         });
  //       },
  //       function (err) {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           console.log("Succesfully updated RSS feed episodes");

  //           if (asyncCallback) {
  //             asyncCallback(null);
  //           }
  //         }
  //       }
  //     );
  //   });
};

const processSpotify = (count = 1, asyncCallback) => {
  const fetchSpotifyEps = (spotify_access_token) => {
    let spotifyEps = [];

    // spotify goes in chronological order, so we have to request
    // ALL of them, then start counting from the back

    const getSpotifyEps = (next) => {
      request.get(
        {
          url: next,
          headers: {
            Authorization: "Bearer " + spotify_access_token,
          },
        },
        function (err, httpResponse, str) {
          if (err) {
            console.log(err);
          } else {
            let body = JSON.parse(str);

            // store those episodes in the spotifyEps array
            spotifyEps = spotifyEps.concat(body.items);

            // check to see if there is a next value
            if (body.next !== null) {
              getSpotifyEps(body.next);
            } else {
              // we need to reverse the array so it's newest first
              spotifyEps = spotifyEps.reverse();

              if (spotifyEps.length > count) {
                spotifyEps.length = count;
              }

              archiveSpotifyEps(spotifyEps);
            }
          }
        }
      );
    };

    const archiveSpotifyEps = (spotifyEps) => {
      // loop through the spotify eps and add their data
      // to any matching episode in the database

      asyncLoop(
        spotifyEps,
        (spotifyEp, next) => {
          const fullTitle = spotifyEp.name.replaceAll("&", "&amp;"),
            spotifyLink = spotifyEp.external_urls.spotify;

          // save to mongodb
          Episode.findOneAndUpdate(
            {
              fullTitle,
            },
            {
              $set: {
                spotifyLink,
              },
            }
          ).exec(function (err, episode) {
            if (err) {
              console.log(err);
            } else {
              next();
            }
          });
        },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Succesfully updated Spotify episodes");

            if (asyncCallback) {
              asyncCallback(null);
            }
          }
        }
      );
    };

    getSpotifyEps(spotifyUrl);
  };

  getSpotifyToken(fetchSpotifyEps);
};

const processiTunes = (count = 1, asyncCallback) => {
  const archiveiTunesEps = (itunesEps) => {
    // loop through the ityunes eps and add their data
    // to any matching episode in the database

    asyncLoop(
      itunesEps,
      (itunesEp, next) => {
        const fullTitle = itunesEp.trackName,
          itunesLink = itunesEp.trackViewUrl;

        // save to mongodb
        Episode.findOneAndUpdate(
          {
            fullTitle,
          },
          {
            $set: {
              itunesLink,
            },
          }
        ).exec(function (err, episode) {
          if (err) {
            console.log(err);
          } else {
            next();
          }
        });
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully updated iTunes episodes");

          if (asyncCallback) {
            asyncCallback(null);
          }
        }
      }
    );
  };

  fetch(itunesUrl + count)
    .then((res) => res.json())
    .then((json) => {
      // get the results
      let iTunesEps = json.results;
      // shift by one to remove the first entry that isn't an episode
      iTunesEps.shift(1);

      archiveiTunesEps(iTunesEps);
    });
};

const processPatreon = (patreonFilter, asyncCallback) => {
  const prepPatreonRequest = (patreon_access_token) => {
    getPatreonPosts(patreonUrl, patreon_access_token);
  };

  let patreonPosts = [];

  const getPatreonPosts = (patreonUrl, patreon_access_token) => {
    request(
      {
        url: patreonUrl,
        headers: {
          Authorization: "Bearer " + patreon_access_token,
        },
      },
      (err, result, body) => {
        if (err) {
          console.log(err);
        } else {
          body = JSON.parse(body);

          // store those episodes in the patreonPosts array
          patreonPosts = patreonPosts.concat(body.data);

          // check to see if there is a next value
          if (body.links !== undefined && body.links.next !== undefined) {
            getPatreonPosts(body.links.next, patreon_access_token);
          } else {
            asyncLoop(
              patreonPosts,
              (post, next) => {
                const postData = patreonFilter(post);

                if (postData.data !== undefined) {
                  Episode.findOneAndUpdate(
                    postData.query,
                    {
                      $set: postData.data,
                    },
                    {
                      upsert: postData.upsert,
                    }
                  ).exec((err) => {
                    if (err) {
                      console.log(err);
                    }

                    next();
                  });
                } else {
                  next();
                }
              },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Successfully updated Patreon episodes");
                  if (asyncCallback) {
                    asyncCallback(null);
                  }
                }
              }
            );
          }
        }
      }
    );
  };

  console.log("trying to get patreon token");
  getPatreonToken(prepPatreonRequest);
};

export { processPatreon };

export const archiveEpisodes = (episodeFormatter, count = 1) => {
  console.log(rssUrl, spotifyUrl, patreonUrl, itunesUrl);
  async.waterfall(
    [
      (callback) => {
        if (rssUrl !== undefined) {
          processRSS(episodeFormatter, count, callback);
        } else {
          console.log("RSS is not defined. Skiping RSS archive");
          callback(null);
        }
      },
      (callback) => {
        if (patreonUrl !== undefined) {
          processPatreon(patreonFilter, callback);
        } else {
          console.log("Patreon URL is not defined. Skipping Patreon archive.");
          callback(null);
        }
      },
      (callback) => {
        if (spotifyUrl !== undefined) {
          processSpotify(count, callback);
        } else {
          console.log("Spotify URL is not defined. Skipping Spotify archive.");
          callback(null);
        }
      },
      () => {
        if (itunesUrl !== undefined) {
          processiTunes(count);
        } else {
          console.log("iTunes URL is not defined. Skipping iTunes archive.");
        }
      },
    ],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};
