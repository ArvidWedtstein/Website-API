
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectLink: {
      type: String,
      required: false
    },
    gitrepo: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false
    },
    tags: {
      type: Array,
      required: false
    },
    pain: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("projects", projectSchema);