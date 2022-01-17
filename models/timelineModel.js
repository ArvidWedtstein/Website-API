
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timelineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    datestart: {
      type: Date,
      required: true
    },
    datestart: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("timeline", timelineSchema);