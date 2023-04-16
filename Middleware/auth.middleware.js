import { userModel } from "../Models/UserSchema";
import { asyncHandler } from "../services/asyncHandler";
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
    res.status(401).json("not authrized to access the route")
  }
  try {
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await userModel.findById(decode._id,"name email role")
    next()
  } catch (error) {
    req.status(401).json("not auth to aceess")
  }
});
