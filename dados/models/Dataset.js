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
var Dataset = new Schema({
  name: String,
  restricted: Boolean,
  restrictedTo: datapointEnum,
  datapoints: [datapoint],
});

/*

{
  type: "string",
  value: "this is the value of the string"
},
{
  type: "keyvalue",
  value: {
    key: "value",
    value: "pair"
  }
}

*/

// create the model for users and expose it to our app
export default mongoose.model("Dataset", Dataset);
