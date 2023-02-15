import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Token = new Schema({
  name: String,
  access_token: String,
  refresh_token: String,
  expires: Date,
});

// create the model for users and expose it to our app
export default mongoose.model("Token", Token);
