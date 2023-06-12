import { userModel } from "../Models/UserSchema.js";
import CustomError from "../Utils/cutomError.js";
import { asyncHandler } from "../services/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token=req.cookies.token ;
    if(!token) {
        throw new CustomError("Not authorized to access the route1", 401)
    }
    try {
        const decode =  jwt.verify(token,process.env.JWT_SECRET)
        req.user = await userModel.findById(decode._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized to access the route | error", 401)
    }
});
