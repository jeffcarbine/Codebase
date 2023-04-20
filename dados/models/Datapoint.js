import mongoose from "mongoose";
var Schema = mongoose.Schema;

const datapointEnum = {
  type: String,
  enum: ["text", "keyvalue", "image", "gallery", "table"],
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
});

// create the model for users and expose it to our app
export default mongoose.model("Datapoint", Datapoint);
