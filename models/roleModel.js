import { Schema, model } from 'mongoose'

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

export default model("roles", roleSchema);
