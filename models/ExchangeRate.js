import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var exchangeRateSchema = new Schema({
  to: String,
  from: String,
  rate: Number,
  lastUpdated: Date,
});

// create the model for users and expose it to our app
export default mongoose.model("ExchangeRate", exchangeRateSchema);
