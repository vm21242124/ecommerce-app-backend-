import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      maxLength: [250, "maxlength is 120"],
    },
    price: {
      type: String,

      required: [true, "price is required"],
      maxLength: [8, "maxlength is 120"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const productModel=mongoose.model("Product",productSchema)