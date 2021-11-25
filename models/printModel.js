
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const printSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: false,
      default: 'none'
    },
    category: {
      type: String,
      required: false,
    },
    stl: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("print", printSchema);