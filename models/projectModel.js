
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = {
  type: String,
  required: true
};
const projectSchema = new Schema(
  {
    name: reqString,
    description: reqString,
    projectLink: {
      type: String,
      required: false
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
    },
    language: {
      type: Array,
      required: false
    },
    github: {
      type: Object,
      required: false,
    },
    hidden: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("projects", projectSchema);