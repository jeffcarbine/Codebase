import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var eventSchema = new Schema({
  venue: String,
  street: String,
  city: String,
  region: String,
  country: String,
  latitude: String,
  longitude: String,
  festival: String,
  date: {
    // simpledate
    type: Number,
    min: 10000000,
    max: 99999999,
  },
  time: String,
  price: Number,
  tickets: String,
  ticketId: String,
  soldOut: Boolean,
  publishDate: {
    // simpledate
    type: Number,
    min: 10000000,
    max: 99999999,
  },
});

// create the model for users and expose it to our app
export default mongoose.model("Event", eventSchema);
