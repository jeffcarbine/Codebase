import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

// define the schema for our user model
const userSchema = new Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
export default mongoose.model("User", userSchema);
