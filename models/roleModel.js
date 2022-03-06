const { Schema, model } = require('mongoose')

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

module.exports = model("roles", roleSchema);
