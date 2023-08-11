import { asyncHandler } from "../services/asyncHandler.js";
import { productModel } from "../Models/Product.schema.js";
import crypto from "crypto";
import { couponModel } from "../Models/Coupon.schema.js";
import { orderSchema } from "../Models/order.schema.js";
import { orderStatus } from "../Utils/orderStatus.js";
import { paymentStatus } from "../Utils/paymentStatus.js";
import {instance} from '../Config/razorpay.config.js'
import CustomError from "../Utils/cutomError.js";



export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  const { products, phoneNumber, address, coupon } = req.body;

  const user = req.user._id;
  if (!(products || user || phoneNumber || address)) {
    throw new CustomError("all fields are required",400);
  }
  let totalamount = 0;
  let descount = 0;
  let activecoupon = "";
  
  for (const item of products) {
    try {
      const product = await productModel.findById(item.productId);
      totalamount = totalamount + Number(product.price) * item.count;
    } catch (error) {
      throw new CustomError("ordered product not found in db",404);
    }
  }

  if (coupon) {
    const usedCoupon = await couponModel.findById(coupon);
    if (usedCoupon.active) {
      activecoupon = usedCoupon;
      descount = totalamount * (usedCoupon.discount / 100);
    }
  }

  let finalAmount = totalamount - descount;
  const options = {
    amount: Math.round(finalAmount) * 100,
    currency: "INR",
    receipt: `receipt _${new Date().getTime()}`,
  };
 
    console.log("options");
    const order = await instance.orders.create(options);

  if (!order) {
    throw new CustomError("failed create order id",400);
  }
  const userOrder = await orderSchema.create({
    products,
    phoneNumber,
    user: req.user,
    address,
    coupon: activecoupon.code,
    amount: finalAmount,
  });

  if (!userOrder) {
    throw new CustomError("failed to storre the order in db",400);
  }
  res.status(200).json({
    success: true,
    order,
    userOrderId: userOrder._id,
  });
});
export const getKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY,
  });
});

export const paymentVerification = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userOrderId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
   
  const isVerified = expectedSignature === razorpay_signature;
  const userOrder = await orderSchema.findById(userOrderId);

  if (isVerified) {
    const products = userOrder.products;
    userOrder.transactionId = razorpay_payment_id;
    userOrder.status = orderStatus.ORDERED;
    userOrder.transactionStatus = paymentStatus.SUCCESS;
    await userOrder.save();
    for (const item of products) {
        // const product = await productModel.findById(item.productId);
     
        // product.stock = product.stock - item.count;
        // // product.sold = product.sold + item.count;
        
        // const saved=await productModel.save();
        // // console.log(product);
      }
     
      res.status(200).json({
      success: true,
      message: "payment successfull",
      paymentId: razorpay_payment_id,
    });
  } else {
    userOrder.transactionStatus = paymentStatus.FAILED;
    throw new CustomError("payment  not verified",400)
  }
});
export const getOrders = asyncHandler(async (req, res) => {
  const userId=req.user._id
  
  if (!userId) {
    throw new CustomError("please send the userid",400);
  }

  const orders = await orderSchema
    .find({ user: userId })
    .sort({ createdAt: "desc" });
  if (!orders.length) {
    return res.status(404).json({
      success: false,
      message: "no order found in db",
    });
  }
  res.status(200).json({
    success: true,
    message: "order founds",
    orders,
  });
});

export const cancleOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    throw new CustomError("please send the order id",400);
  }
  const order = await orderSchema.findById(orderId);
  if (!order) {
    throw new CustomError("no order found",404);
  }
  order.status = orderStatus.CANCELLED;
  await orderSchema.save();
  res.status(200).json({
    success: true,
    message: "order cancelled",
  });
});

export const getOrderStatus = asyncHandler(async (req, res) => {
  const { s } = req.query;
  if (!s) {
    throw new CustomError("query string not found",400);
  }
  const orderCount = await orderSchema.countDocuments({ status: s });
  res.status(200).json({
    success: true,
    status: s,
    count: orderCount,
  });
});

export const getAllorders = asyncHandler(async (req, res) => {
  
  try {
    const orders = await orderSchema
      .find()
      .sort({ createdAt: "desc" })
    
      if (!orders) {
        throw new CustomError("no orders found",400);
      }
      res.status(200).json({
        success: true,
        orders,
      });
  } catch (error) {
    console.log(error.message);
  }
});
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderSchema.findById(id).populate("user", "name");
  if (!order) {
    throw new CustomError("not found ",404);
  }
  res.status(200).json({
    success: true,
    order,
  });
});
export const editOrder = asyncHandler(async (req, res) => {
  if (!(req.user.role === "ADMIN")) {
    throw new CustomError("you dont have to access this route",401);
  }
  const { id } = req.params;
  if(!id){
    throw new CustomError("id is not availble",404);
  }
  const { address, phoneNumber, status } = req.body;
  if (!order) {
    throw new CustomError("not found ",404);
  }
  address ? (orderSchema.address = address) : "";
  phoneNumber ? (orderSchema.phoneNumber = phoneNumber) : "";
  status ? (order.status = status) : "";
  await orderSchema.save();
  res.status(200).json({
    success: true,
    order,
  });
});
