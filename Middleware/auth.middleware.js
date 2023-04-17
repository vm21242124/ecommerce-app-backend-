import { userModel } from "../Models/UserSchema.js";
import { asyncHandler } from "../services/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const isLoggedIn = asyncHandler(async (req, res,next) => {
  let token;
  if (
    req.cookies.token ||
    (req.headers.authorization && req.headers.startWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split("")[1];
  }
  if(!token){
    return res.status(401).json("Login first to see all collections")
  }
  try {
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await userModel.findById(decode._id);
    next()
  } catch (error) {
    req.status(400).json(error)
  }
});
