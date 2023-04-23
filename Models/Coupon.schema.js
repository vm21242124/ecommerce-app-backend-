import mongoose from "mongoose";

const coupon = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "coupon is required"],
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export const couponModel=mongoose.model("coupon",coupon);