const { Schema, model } = require('mongoose')
const sessionSchema = new Schema(
  {
    session: {
      type: String,
      required: false,
    },
    userID: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    connected: {
        type: Boolean,
        required: false,
    }
  },
  { timestamps: true }
);

module.exports = model("sessions", sessionSchema);