import { userModel } from "../Models/UserSchema.js";
import CustomError from "../Utils/cutomError.js";
import { asyncHandler } from "../services/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token
    if(req.cookies.token ||
        req.headers.authorization && 
        req.headers.startWith("Bearer")) {
            token = req.cookies.token ||
            req.headers.authorization.split(" ")[1]
        }

    if(!token) {
        throw new CustomError("Not authorized to access the route1", 401)
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await userModel.findById(decode._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized to access the route | error", 401)
    }
});
