import async from "async";
import { load as cheerioLoad } from "cheerio";
import cloudscraper from "cloudscraper";

export const getKicktraqData = (relativePath) => {
  async.waterfall(
    [
      (callback) => {
        cloudscraper
          .get(`https://www.kicktraq.com/projects/${relativePath}`)
          .then((html) => {
            const cheerioPage = cheerioLoad(html);

            const text = cheerioPage("#project-info-text").text().trim(),
              funding = text
                .split("Funding:")[1]
                .split("Dates")[0]
                .split(" of "),
              goal = funding[1].trim(),
              total = funding[0].trim();

            const data = {
              goal,
              total,
            };

            callback(null, data);
          })
          .catch((err) => {
            callback(err);
          });
      },
      (data) => {
        console.log(data);
        return data;
      },
    ],
    (err) => {
      console.log(err);
      return err;
    }
  );
};
