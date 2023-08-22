import mongoose from "mongoose";
var Schema = mongoose.Schema;
import { datapointList, groupTypes } from "./datapointList.js";

const datapointEnum = {
  type: String,
  enum: datapointList,
  default: "text",
};

const groupTypeEnum = {
  type: String,
  enum: groupTypes,
  default: "object",
};

const datapoint = {
  accordionOpen: Boolean,
  name: String,
  type: datapointEnum,
  active: {
    type: Boolean,
    default: true,
  },
  global: Boolean,
  name: String,
  text: String,
  link: {
    title: String,
    href: String,
  },
  html: String,
  image: {
    src: String,
    alt: String,
  },
  groupType: groupTypeEnum,
  group: Array,
};

// define the schema for our user model
var Datapoint = new Schema(datapoint);

// create the model for users and expose it to our app
export default mongoose.model("Datapoint", Datapoint);
