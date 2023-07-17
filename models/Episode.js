import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Episode = new Schema({
  episodeId: String,
  show: String,
  pubDate: Date,
  series: String,
  title: String,
  description: String,
  thumbnail: String,
  thumbnailSmall: String,

  rssLink: String,
  appleLink: String,
  youTubeLink: String,
  spotifyLink: String,
  patreonLink: String,
  patreonVideoLink: String,

  patreonExclusive: Boolean,
  aftershowLink: String,
  localPath: String,
});

// create the model for users and expose it to our app
export default mongoose.model("Episode", Episode);
