
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("roles", roleSchema);
