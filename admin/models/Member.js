import mongoose from "mongoose";
var Schema = mongoose.Schema;

// define the schema for our user model
var Member = new Schema({
  email: String,
  phone: String,
  country: String,
  shirtSize: {
    type: String,
    enum: ["xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl"],
    default: "m",
  },
  shirtCut: {
    type: String,
    enum: ["unisex", "ladies"],
    default: "unisex",
  },
  address: {
    addressee: String,
    city: String,
    country: String,
    line_1: String,
    line_2: String,
    postal_code: String,
    state: String,
  },
  merchClubMemberships: [
    {
      year: {
        type: Number,
        min: 2023,
      },
      quarter: {
        type: Number,
        enum: [1, 2, 3, 4],
      },
      _id: false,
    },
  ],
  currentPledge: Number,
});

// create the model for users and expose it to our app
export default mongoose.model("Member", Member);
