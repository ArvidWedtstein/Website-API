const { Schema, model } = require('mongoose')

const newspostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    sectionBlocks: {
      type: Object,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    tags: {
      type: Object,
      required: false,
    },
    reactions: {
        type: Object,
        required: false
    }
  },
  { timestamps: true }
);

module.exports = model("Newspost", newspostSchema);