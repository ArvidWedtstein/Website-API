import { Schema, model } from 'mongoose'

const reviewSchema = new Schema(
  {
    author: {
      type: String,
      required: false,
      default: "none"
    },
    rating: {
      type: Number,
      required: true
    },
    review: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default model("reviews", reviewSchema);