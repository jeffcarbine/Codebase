import mongoose from "mongoose";
const Schema = mongoose.Schema;

// define the schema for our user model
const showSchema = new Schema({
  title: String,
  private: Boolean,
  rss: String,
  patreon: String,
  spotify: String,
  youTube: String,
  apple: String,
  episodes: [
    {
      id: String,
      title: String,
    },
  ],
});

// create the model for users and expose it to our app
export default mongoose.model("Show", showSchema);
