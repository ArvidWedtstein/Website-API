
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
        type: String, 
        required: true,
        default: "61e54d738d85aacb59ce3338" // Peasant role
    },
    profileimg: {
      type: String,
      required: false,
    },
    banned: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);