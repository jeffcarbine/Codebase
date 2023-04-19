import mongoose from "mongoose";
var Schema = mongoose.Schema;

const datapointEnum = {
  type: String,
  enum: ["text", "keyvalue", "image", "gallery", "event", "show", "table"],
  default: "text",
};

const datapoint = {
  type: datapointEnum,
  id: String,
};

// define the schema for our user model
var Datapoint = new Schema({
  name: String,
  type: datapointEnum,
  // different places for different values
  text: {
    value: String,
  },
  event: {
    venue: String,
    street: String,
    city: String,
    region: String,
    country: String,
    latitude: String,
    longitude: String,
    festival: String,
    date: Date,
    price: Number,
    tickets: String,
    ticketId: String,
    soldOut: Boolean,
  },
  show: {
    title: String,
    private: Boolean,
    rss: String,
    patreon: String,
    spotify: String,
    youTube: String,
    apple: String,
    episodes: [
      {
        id: String,
        title: String,
      },
    ],
  },
});

// create the model for users and expose it to our app
export default mongoose.model("Datapoint", Datapoint);
