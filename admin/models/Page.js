import mongoose from "mongoose";
var Schema = mongoose.Schema;

export const wildcardEnum = [
  "none",
  "podcast",
  "episode",
  "product",
  "collection",
];

const Models = new mongoose.Schema({
  value: { type: String, enum: ["Tier"] },
});

// define the schema for our user model
const Page = new Schema({
  name: String,
  description: String,
  path: String,
  wildcard: {
    type: String,
    enum: wildcardEnum,
    default: "none",
  },
  homepage: Boolean,
  models: [{ type: String, refs: Models }],
  datapoints: Array,
});

// create the model for users and expose it to our app
export default mongoose.model("Page", Page);
