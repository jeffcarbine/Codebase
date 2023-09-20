import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var File = new Schema({
  name: String,
  type: String,
  value: String,
});

// create the model for users and expose it to our app
export default mongoose.model("File", File);
