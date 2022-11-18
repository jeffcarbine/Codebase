import Event from "../../../models/Event.js";
import asyncLoop from "node-async-loop";
import fetch from "node-fetch";

export const detectSoldOut = () => {
  console.log("checking to see if shows have sold out...");
  const now = new Date();

  Event.aggregate([
    {
      $match: {
        date: {
          $gt: now,
        },
      },
    },
  ]).exec((err, events) => {
    if (err) {
      console.log(err);
    } else {
      asyncLoop(
        events,
        (event, next) => {
          // get the event's data
          const url = event.tickets,
            city = event.city,
            ticketId = event.ticketId;

          const callback = (soldOut) => {
            if (soldOut) {
              console.log("found a sold out event!");
            }
          };

          // check which provider it is with
          if (url.includes("ticketmaster")) {
            console.log("found a ticketmaster event!");
            checkTicketmaster(ticketId, city, callback);
          } else {
            next();
          }
        },
        (err) => {}
      );
    }
  });
};

const checkTicketmaster = (ticketId, city, callback) => {
  const ticketmasterApiKey = process.env.TICKETMASTERAPIKEY;

  fetch(
    "https://app.ticketmaster.com/discovery/v2/events.json?keyword=not+another+d%26d+podcast&city=" +
      city +
      "&apikey=" +
      ticketmasterApiKey
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    })
    .catch((err) => {
      console.log(err);
    });
};
