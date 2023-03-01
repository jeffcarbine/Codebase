import mongoose from "mongoose";
const Schema = mongoose.Schema;

// define the schema for our episode model
const episodeSchema = new Schema({
  rssId: String,
  title: String,
  preTitle: String,
  postTitle: String,
  description: String,
  links: {
    audio: String,
    itunes: String,
    spotify: String,
  },
  patreon: {
    adfree: String,
    aftershow: String,
  },
  published: Date,
});

// create the model for users and expose it to our app
export default mongoose.model("Episode", episodeSchema);
