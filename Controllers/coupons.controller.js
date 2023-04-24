import { couponModel } from "../Models/Coupon.schema.js";
import { asyncHandler } from "../services/asyncHandler.js";

export const createCoupon=asyncHandler(async(req,res)=>{
    const {name,discount}=req.body;
    if(!(req.user.role==="ADMIN")){
        return res.status(403).json("you are not allowed to create coupon")
    }
    if(!(name || discount)){
        return res.status(401).json("enter all the details")
    }
    if(discount<0 && discount>100){
        return res.status(400).json("discount cannot be more than 100%")
    }
    const coupon=await couponModel.create({
        code:name.toUpperCase(),
        discount,
    })
    if(!coupon){
        return res.status(400).json("faild to create the coupon")
    }
    return res.status(200).json({
        sucess:true,
        coupon
    })
})
export const updateCopoun=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    let {property,value}=req.body;
    if(req.user.role==="ADMIN"){
        return res.status(403).json("you are not allowed")
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
        return res.status(400).json("id is required")
    }
    if(!property && !value){
        return res.status(400).json("fill all the details")
    }
    const coupon=couponModel.findById(id);
    if(!coupon){
        return res.status(400).json("coupon not found")
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
        return res.status(400).json("id is required")
    }
    const responce=await couponModel.findByIdAndDelete(id)
    if(responce){
        res.status(200).json({
            success:true,
            message:"coupon deleted suceessfully"
        })
    }else{
        res.status(400).json({
            success:false,
            message:"Error in deleting the coupon"
        })   
    }
})
export const getAllCoupons=asyncHandler(async(req,res)=>{
    const coupons=await couponModel.find();
    if(coupons.length===0){
        return res.status(400).json("no coupons are available")
    }
    return res.status(200).json({
        success:true,
        coupons
    })
})
export const getAllActiveCoupons=asyncHandler(async(req,res)=>{
    const coupons=await couponModel.find({active:true})
    if(coupons.length===0){
        return res.status(400).json("no active coupons are there")
    }
    return res.status(200).json({
        success:true,
        coupons
    })
})
export const getCouponsbyId=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json("id is required")
    }
    const coupon=await couponModel.findById(id)
    if(!coupon){
        return res.status(400).json("no coupons is there")
    }
    return res.status(200).json({
        success:true,
        coupons
    })
})