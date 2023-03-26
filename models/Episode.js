import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Episode = new Schema({
  episodeId: String,
  pubDate: Date,
  fullTitle: String,
  series: String,
  preTitle: String,
  title: String,
  postTitle: String,
  description: String,
  audioLink: String,
  itunesLink: String,
  appleLink: String,
  youTubeLink: String,
  spotifyLink: String,
  patreonLink: String,
  patreonVideoLink: String,
  patreonExclusive: Boolean,
  shortRestLink: String,
  aftershowLink: String,
});

// create the model for users and expose it to our app
export default mongoose.model("Episode", Episode);
