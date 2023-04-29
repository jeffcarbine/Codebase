import { get_admin_route } from "../../../modules/get_route.js";
import Event from "../../../models/Event.js";
import NodeGeocoder from "node-geocoder";
import { google_maps_api_key } from "../../../apis/google_maps.js";

const options = {
  provider: "google",
  apiKey: google_maps_api_key,
};

const geocoder = NodeGeocoder(options);

export const events = (req, res, next) => {
  get_admin_route(req, res, next, (mainCallback) => {
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
        callback(err);
      } else {
        // sort the events by date
        events.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        return mainCallback("events", { events, path: "/admin/events" });
      }
    });
  });
};

const geocode = (body, callback) => {
  const address =
    body.street + " " + body.city + " " + body.region + " " + body.country;

  geocoder
    .geocode(address)
    .then((location_geocode) => {
      body.latitude = location_geocode[0].latitude;
      body.longitude = location_geocode[0].longitude;

      callback(null, body);
    })
    .catch((err) => {
      callback(err);
    });
};

export const addEvent = (req, res, next) => {
  const body = req.body,
    tickets = body.tickets;

  console.log(body);

  // const createEvent = (err, body) => {
  // if (err) {
  //   return res.status(500).send(err);
  // } else {
  // add this event to the database
  Event.findOneAndUpdate(
    {
      tickets,
    },
    {
      $set: body,
    },
    {
      upsert: true,
      new: true,
    }
  ).exec((err, event) => {
    console.log(err);

    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send("Event was successfully recorded!");
  });
  //}
  // };

  // if (body.street !== undefined && body.street !== "") {
  //   geocode(body, createEvent);
  // }
};

export const editEvent = (req, res, next) => {
  console.log("editing event!");
  const updateEvent = (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // update event in database
      Event.findOneAndUpdate(
        {
          _id: data.id,
        },
        {
          $set: data,
        }
      ).exec((err, event) => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.status(200).send("Event change was successfully recorded!");
      });
    }
  };

  let body = req.body,
    data = {
      ...body.hidden,
      ...body.data,
    };

  // check to see if this is an address change
  if (
    data.street !== undefined ||
    data.city !== undefined ||
    data.region !== undefined ||
    data.country !== undefined
  ) {
    // then we need to generate new coordinates
    Event.findOne({
      _id: data.id,
    }).exec((err, event) => {
      // update the corresponding value
      for (let key in data) {
        event[key] = data[key];
      }

      // and create the new

      // and now geocode it, and update the event
      geocode(event, updateEvent);
    });
  } else {
    updateEvent(null, data);
  }
};

export const deleteEvent = (req, res, next) => {
  // find the event in question and delete it

  const body = req.body,
    eventId = body.eventId;

  Event.findOneAndDelete({
    _id: eventId,
  }).exec((err) => {
    if (err) {
      return res.status(500).send();
    } else {
      return res.status(200).send();
    }
  });
};
