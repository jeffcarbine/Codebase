import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Setting = new Schema({
  group: String,
  name: String,
  value: String,
});

// create the model for users and expose it to our app
export default mongoose.model("Setting", Setting);
