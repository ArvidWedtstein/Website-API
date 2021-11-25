
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newspostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: false
    },
    tags: {
      type: Object,
      required: false,
    },
    comments: {
        type: Object,
        required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newspost", newspostSchema);