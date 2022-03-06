import { Schema, model } from 'mongoose'

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

export default model("print", printSchema);