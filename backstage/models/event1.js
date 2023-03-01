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
  date: Date,
  price: Number,
  tickets: String,
  ticketId: String,
  soldOut: Boolean,
});

// create the model for users and expose it to our app
export default mongoose.model("Event", eventSchema);
