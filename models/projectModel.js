import { Schema, model } from 'mongoose'

const yEs = (type, required) => {
  return {
    type: type,
    required: required
  }
};
const projectSchema = new Schema(
  {
    name: yEs(String, true),
    description: yEs(String, true),
    projectLink: yEs(String, false),
    thumbnail: yEs(String, false),
    tags: yEs(Array, false),
    pain: yEs(Number, false),
    language: yEs(Array, false),
    github: yEs(Object, false),
    hidden: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  { timestamps: true }
);

export default model("projects", projectSchema);