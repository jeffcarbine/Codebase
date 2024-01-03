import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

export const forwardXML = (req, res, feed) => {
  fetch(feed)
    .then((response) => response.text())
    .then((feed) => res.status(200).set("Content-Type", "text/xml").send(feed));
};

export const forwardXMLFromEnv = (req, res) => {
  const feed = process.env.FORWARDXMLFEED;
  forwardXML(req, res, feed);
};
