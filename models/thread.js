import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

// define the schema for our user model
const threadSchema = new Schema({
  userId: String,
  created: Date,
  messages: [
    {
      to: String,
      messageType: String,
      body: String,
      timestamp: Date,
    },
  ],
});

// create the model for users and expose it to our app
export default mongoose.model("Thread", threadSchema);
