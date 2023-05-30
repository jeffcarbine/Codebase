import mongoose from "mongoose";
var Schema = mongoose.Schema;

const defaultDatapoints = [
  "text",
  "html",
  "image",
  "group",
  // "podcast",
  // "episode",
  // "person",
];

const wildcardDatapoints = [
  // "wildcardEpisode",
  // "wildcardPodcast",
  // "wildcardGroup",
];

export const datapointList = [...defaultDatapoints, ...wildcardDatapoints];

const datapointEnum = {
  type: String,
  enum: datapointList,
  default: "text",
};

const datapoint = {
  name: String,
  type: datapointEnum,
  name: String,
  text: String,
  html: String,
  image: {
    src: String,
    alt: String,
  },
  group: Array,
};

// define the schema for our user model
var Datapoint = new Schema(datapoint);

// create the model for users and expose it to our app
export default mongoose.model("Datapoint", Datapoint);
