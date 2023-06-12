import { couponModel } from "../Models/Coupon.schema.js";
import CustomError from "../Utils/cutomError.js";
import { asyncHandler } from "../services/asyncHandler.js";

export const createCoupon=asyncHandler(async(req,res)=>{
    const {name,discount}=req.body;
    if(!(req.user.role==="ADMIN")){
        throw new CustomError("you are not allowed to create coupon",403)
    }
    if(!(name || discount)){
        throw new CustomError("enter all the details",401)
    }
    if(discount<0 && discount>100){
        throw new CustomError("discount cannot be more than 100%",400)
    }
    const coupon=await couponModel.create({
        code:name.toUpperCase(),
        discount,
    })
    if(!coupon){
        throw new CustomError("faild to create the coupon",400)
    }
    return res.status(200).json({
        sucess:true,
        coupon
    })
})
export const updateCopoun=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    let {property,value}=req.body;
    if(!req.user.role==="ADMIN"){
        throw new CustomError("you are not allowed",403)
    }
    console.log(property,value)
    if(property==="status"){
        property="active"
        value=Boolean(value)
    }else if(property==="discount"){
        value=Number(value)
    }else if(property==="name"){
        property="code"
        value=value.toUpperCase();

    }
    if(!id){
        throw new CustomError("id is required",400)
    }
    if(!property && !value){
        throw new CustomError("fill all the details",400)
    }
    const coupon=couponModel.findById(id);
    if(!coupon){
        throw new CustomError("coupon not found",400)
    }
    coupon[property]=value
    await couponModel.save();
    return res.status(200).json({
        sucess:true,
        coupon
    })
})
export const deleteCoupon=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
        throw new CustomError("id is required",400)
    }
    const responce=await couponModel.findByIdAndDelete(id)
    if(responce){
        res.status(200).json({
            success:true,
            message:"coupon deleted suceessfully"
        })
    }else{
        throw new CustomError("delete error",500)   
    }
})
export const getAllCoupons=asyncHandler(async(req,res)=>{
    const coupons=await couponModel.find();
    if(coupons.length===0){
        throw new CustomError("no coupons are available",400)
    }
    return res.status(200).json({
        success:true,
        coupons
    })
})
export const getAllActiveCoupons=asyncHandler(async(req,res)=>{
    const coupons=await couponModel.find({active:true})
    if(coupons.length===0){
        throw new CustomError("no active coupons are there",400)
    }
    return res.status(200).json({
        success:true,
        coupons
    })
})
export const getCouponsbyId=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
        throw new CustomError("id is required",400)
    }
    const coupon=await couponModel.findById(id)
    if(!coupon){
        throw new CustomError("no coupons is there",400)
    }
    return res.status(200).json({
        success:true,
        coupon
    })
})