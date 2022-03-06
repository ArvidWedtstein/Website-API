const { Schema, model } = require('mongoose')
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
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("print", printSchema);