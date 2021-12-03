
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("reviews", reviewSchema);