import Event from "../../models/Event.js";

export const get__backstage_widgets = (req, res, next) => {
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

      res.render("widgets", {
        path: "/backstage/widgets",
        subtitle: "Events",
        events,
      });
    }
  });
};

export const post__backstage_events_add = (req, res, next) => {
  let body = req.body;
  body.date = new Date(req.body.date);

  console.log(body);

  Event.findOneAndUpdate(
    {
      date: body.date,
    },
    {
      $set: body,
    },
    {
      upsert: true,
      new: true,
    }
  ).exec((err, event) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send("Event was successfully recorded!");
  });
};

export const post__backstage_events_edit = (req, res, next) => {
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

export const post__backstage_events_delete = (req, res, next) => {
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
