const { Schema, model } = require('mongoose')

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

module.exports = model("reviews", reviewSchema);