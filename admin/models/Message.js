import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Message = new Schema({
  name: String,
  email: String,
  phone: String,
  reason: String,
  body: String,
});

// create the model for users and expose it to our app
export default mongoose.model("Message", Message);
