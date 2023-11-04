import Page from "../../admin/models/Page.js";
import Episode from "../../admin/models/Episode.js";

import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";
import asyncLoop from "node-async-loop";

export const sitemapAndRobots = (app, hostname) => {
  let sitemap;

  app.get("/sitemap.xml", function (req, res) {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    // if we have a cached entry send it
    if (sitemap) {
      res.send(sitemap);
      return;
    }

    try {
      const smStream = new SitemapStream({
        hostname,
      });
      const pipeline = smStream.pipe(createGzip());

      // get all the pages from the database
      Page.find().exec((err, pages) => {
        if (err) {
          throw new Error(err);
        } else {
          asyncLoop(
            pages,
            (page, next) => {
              if (page.wildcard === "none") {
                // this is a standard page and we can just add it to the sitemap
                smStream.write({ url: page.path, changefreq: "monthly" });

                // and move on
                next();
              } else {
                // detect what kind of wildcard page this is
                if (page.wildcard === "episode") {
                  // get all the episodes and create the page for each episode
                  Episode.find().exec((err, episodes) => {
                    if (err) {
                      throw new Error(err);
                    } else {
                      asyncLoop(
                        episodes,
                        (episode, nextEpisode) => {
                          smStream.write({
                            url: `${page.path}/${episode.localPath}`,
                            changefreq: "monthly",
                          });

                          nextEpisode();
                        },
                        (err) => {
                          next();
                        }
                      );
                    }
                  });
                } else {
                  next();
                }
              }
            },
            (err) => {
              if (err) {
                throw new Error(err);
              } else {
                // cache the response
                streamToPromise(pipeline).then((sm) => (sitemap = sm));

                // make sure to attach a write stream such as streamToPromise before ending
                smStream.end();

                // stream write the response
                pipeline.pipe(res).on("error", (e) => {
                  throw e;
                });
              }
            }
          );
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  app.get("/robots.txt", (req, res) => {
    const text = `
      User-agent: *
      Disallow: 
      Disallow: /admin
      Sitemap: ${hostname}/sitemap.xml`;

    res.type("text/plain");
    res.send(text);
  });
};
