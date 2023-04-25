import async from "async";
import asyncLoop from "node-async-loop";
import pkg from "rss-to-json";
const { parse } = pkg;
import request from "request";

import Show from "../../models/Show.js";
import Episode from "../../models/Episode.js";

import { getSpotifyToken } from "../../apis/spotify.js";
import { fetchYouTubePlaylist } from "../../apis/youtube.js";

const defaultRssArchiver = (show, count, callback) => {
  console.log("getting episodes from RSS feed");
  const url = show.rss;

  parse(url).then((feed) => {
    const episodes = feed.items;
    if (episodes.length > count) {
      episodes.length = count;
    }

    asyncLoop(
      episodes,
      (episode, next) => {
        const pubDate = new Date(episode.published);

        // save to mongodb
        Episode.findOneAndUpdate(
          {
            episodeId: episode.id,
          },
          {
            $set: {
              episodeId: episode.id,
              show: show._id,
              pubDate,
              title: episode.title,
              description: episode.description,
              rssLink: episode.enclosures[0].url,
            },
          },
          {
            upsert: true,
          }
        ).exec((err) => {
          if (err) {
            callback(err);
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
          callback(null);
        }
      }
    );
  });
};

const defaultSpotifyArchiver = (show, count, callback) => {
  const fetchSpotifyEps = (spotify_access_token) => {
    let spotifyEps = [];

    const spotifyUrl = show.spotify;
    console.log(spotifyUrl);

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
        (err, httpResponse, str) => {
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
          const title = spotifyEp.name,
            spotifyLink = spotifyEp.external_urls.spotify;

          // save to mongodb
          Episode.findOneAndUpdate(
            {
              title,
            },
            {
              $set: {
                spotifyLink,
              },
            }
          ).exec((err) => {
            if (err) {
              console.log(err);
            } else {
              next();
            }
          });
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Succesfully updated Spotify episodes");

            callback(null);
          }
        }
      );
    };

    getSpotifyEps(spotifyUrl);
  };

  getSpotifyToken(fetchSpotifyEps);
};

const defaultYouTubeArchiver = (show, count, callback) => {
  const playlistId = show.youTube;

  const archiveYouTubeVideos = (videos) => {
    videos = videos.reverse();
    if (videos.length > count) {
      videos.length = count;
    }

    asyncLoop(
      videos,
      (video, next) => {
        // save to mongodb
        Episode.findOneAndUpdate(
          {
            title: video.snippet.title,
          },
          {
            $set: {
              thumbnail: video.snippet.thumbnails.maxres.url,
              youTubeLink:
                "https://www.youtube.com/watch?v=" +
                video.snippet.resourceId.videoId,
            },
          }
        ).exec((err) => {
          if (err) {
            callback(err);
          } else {
            next();
          }
        });
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully updated YouTube episodes");
          callback(null);
        }
      }
    );
  };

  fetchYouTubePlaylist(playlistId, archiveYouTubeVideos);
};

const defaultAppleArchiver = (show, count, callback) => {
  const apple = show.apple;

  const archiveAppleEpisodes = (episodes) => {
    // loop through the ityunes eps and add their data
    // to any matching episode in the database

    asyncLoop(
      episodes,
      (episode, next) => {
        const title = episode.trackName,
          appleLink = episode.trackViewUrl;

        // save to mongodb
        Episode.findOneAndUpdate(
          {
            title,
          },
          {
            $set: {
              appleLink,
            },
          }
        ).exec((err, episode) => {
          if (err) {
            console.log(err);
          } else {
            next();
          }
        });
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully updated Apple episodes");

          callback(null);
        }
      }
    );
  };

  fetch(
    "https:/itunes.apple.com/lookup?id=" +
      apple +
      "&media=podcast&entity=podcastEpisode&limit=" +
      count
  )
    .then((res) => res.json())
    .then((json) => {
      // get the results
      let episodes = json.results;
      // shift by one to remove the first entry that isn't an episode
      episodes.shift(1);

      archiveAppleEpisodes(episodes);
    });
};

export const archiveEpisodes = ({
  count = 1,
  rssArchiver = defaultRssArchiver,
  spotifyArchiver = defaultSpotifyArchiver,
  youTubeArchiver = defaultYouTubeArchiver,
  appleArchiver = defaultAppleArchiver,
} = {}) => {
  console.log(count);

  Show.find().exec((err, shows) => {
    if (err) {
      console.log(err);
    } else {
      shows.forEach((show) => {
        archiveLatestEpisode(
          show,
          count,
          rssArchiver,
          spotifyArchiver,
          youTubeArchiver,
          appleArchiver
        );
      });
    }
  });
};

const archiveLatestEpisode = (
  show,
  count,
  rssArchiver,
  spotifyArchiver,
  youTubeArchiver,
  appleArchiver
) => {
  async.waterfall(
    [
      // RSS check
      (callback) => {
        if (show.rss !== "") {
          rssArchiver(show, count, callback);
        } else {
          callback(null);
        }
      },
      // Patreon
      (callback) => {
        if (show.patreon !== "") {
          patreonArchiver(show, count, callback);
        } else {
          callback(null);
        }
      },
      // Spotify
      (callback) => {
        if (show.spotify !== "") {
          spotifyArchiver(show, count, callback);
        } else {
          callback(null);
        }
      },
      // YouTube
      (callback) => {
        if (show.youTube !== "") {
          youTubeArchiver(show, count, callback);
        } else {
          callback(null);
        }
      },
      // Apple
      (callback) => {
        if (show.apple !== "") {
          appleArchiver(show, count, callback);
        } else {
          callback(null);
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
