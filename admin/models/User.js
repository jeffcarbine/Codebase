import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

// define the schema for our user model
const userSchema = new Schema({
  // their email address
  username: String,
  // their password
  password: String,
  // a password reset token
  passwordResetToken: String,
  // a password reset token expiration date
  passwordResetExpires: Date,
  // their first name
  firstName: String,
  // their last name
  lastName: String,
  // security clearance level
  // 0 = admin
  // 1 = creator
  // 2 = team member
  // 99 = patron
  clearance: {
    type: Number,
    min: 0,
    max: 99,
    default: 99,
  },
  // their current pledge amount in cents
  pledge: Number,
  // their pledge history
  history: [
    {
      date: Date,
      amount: Number,
    },
  ],
  // customer id in square
  customerId: String,
  // last four digits of their card on file
  lastFourOfCard: String,
});

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
export default mongoose.model("User", userSchema);
