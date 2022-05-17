const { Schema, model } = require('mongoose')
const messageSchema = new Schema(
  {
    from: {
      type: String,
      required: false,
    },
    to: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    }
  },
  { timestamps: true }
);

module.exports = model("messages", messageSchema);