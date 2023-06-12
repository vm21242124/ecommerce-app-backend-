import { userModel } from "../Models/UserSchema.js";
import CustomError from "../Utils/cutomError.js";
import { asyncHandler } from "../services/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.cookies.token ||
    (req.headers.authorization && req.headers.startWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new CustomError("User Not Logged In", 400);
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decode._id);
    next();
  } catch (e) {
    throw new CustomError("Not Allowed",401)   
  }
});
