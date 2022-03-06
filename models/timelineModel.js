
import { Schema, model } from 'mongoose'

const timelineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    startdate: {
      type: String,
      required: true
    },
    enddate: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("timeline", timelineSchema);