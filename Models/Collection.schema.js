import mongoose from "mongoose";
const collectionschma = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name of the category is required"],
      unique: true,
      trim: true,
      maxLength: [50, "maxlength is 50"],
    },
  },
  {
    timestamps: true,
  }
);
export const collectionModel=mongoose.model("Collection",collectionschma)