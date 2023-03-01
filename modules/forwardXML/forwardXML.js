import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

export const forwardXML = (req, res) => {
  fetch(process.env.RSSURL)
    .then((response) => response.text())
    .then((feed) => res.status(200).set("Content-Type", "text/xml").send(feed));
};
