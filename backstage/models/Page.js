import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Page = new Schema({
  name: String,
  widgets: [
    {
      type: {
        type: String,
        enum: ["text", "keyvalue", "image", "gallery"],
        default: "string",
      },
      id: String,
    },
  ],
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
export default mongoose.model("Page", Page);
