import mongoose from "mongoose";
import { authRoles } from "../Utils/authRoles.js";
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
      maxLength: [50, "Name must be less than 50"],
      trime: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password atleast 6 digit"],
      select: false,
    },
    roles: {
      type: String,
      enum: Object.values(authRoles),
      default: authRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestams: true }
);
//pre hook for saving the user hashing password middleware
userschema.pre("save",async function(next){
    if(!this.isModified("password"))
    return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})
userschema.methods={
    comparePass:async (enteredPass)=>{
        return await bcrypt.compare(enteredPass,this.password)
    },
    getJwtToken:async ()=>{
        return jwt.sign({
            _id:this._id,
            role:this.role
        }),
        process.env.JWT_SECRET,{
            expiresIn:'30d'
        }
    },
    generateForgotPassToken:function(){
        const token=crypto.randomBytes(20).toString('hex')
        this.forgotPasswordToken=crypto.createHash("sha256").update(token).digest('hex')
        this.forgotPasswordExpiry=Date.now()+20*60*1000
        return token
    }
}
export const userModel=mongoose.model('User',userschema)