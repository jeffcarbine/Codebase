import mongoose from "mongoose";
const Schema = mongoose.Schema;

// define the schema for our user model
const podcastSchema = new Schema({
  title: String,
  private: Boolean,
  rss: String,
  episodes: [
    {
      id: String,
      title: String,
    },
  ],
});

// create the model for users and expose it to our app
export default mongoose.model("Podcast", podcastSchema);
