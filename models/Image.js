import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Image = new Schema({
  postId: String,
  title: String,
  date: Date,
  href: String,
});

// create the model for users and expose it to our app
export default mongoose.model("Image", Image);
