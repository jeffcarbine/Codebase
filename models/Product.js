import mongoose from "mongoose";
const Schema = mongoose.Schema;

const priceSchema = new Schema({
  amount: String,
  currencyCode: String,
});

const imageSchema = new Schema({
  id: String,
  src: String,
  altText: String,
  width: Number,
  height: Number,
});

const valueSchema = new Schema({
  name: String,
  id: String,
  available: Boolean,
  price: priceSchema,
  compareAtPrice: priceSchema,
  imageid: String,
});

const reviewSchema = new Schema({
  name: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  title: String,
  body: String,
  date: Number, // simpledate
});

// define the schema for our product model
const productSchema = new Schema({
  name: String,
  handle: String,
  availableForSale: Boolean,
  description: String,
  price: priceSchema,
  compareAtPrice: priceSchema,
  values: [valueSchema],
  id: String,
  images: [imageSchema],
  tags: [String],
  type: String,
  boughtTogether: {
    type: [String],
    default: [],
  },
  recommendations: {
    type: [String],
    default: [],
  },
  addOns: {
    type: [String],
    default: [],
  },
  reviews: {
    type: [reviewSchema],
    default: [],
  },
});

// create the model for products and expose it to our app
export default mongoose.model("Product", productSchema);
