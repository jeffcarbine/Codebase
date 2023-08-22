import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Fanart = new Schema({
  title: String,
  description: String,
  artist: String,
  email: String,
  artistUrl: String,
  tags: Array,
  image: String,
  purchaseUrl: String,
  submittedOn: Number,
  approved: Boolean,
});

// create the model for users and expose it to our app
export default mongoose.model("Fanart", Fanart);
