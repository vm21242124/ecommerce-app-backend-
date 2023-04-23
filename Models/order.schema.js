const { default: mongoose } = require("mongoose");

const order = new mongoose.Schema({
  products: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        count:Number,
        price:String
      },
    ],
    required:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  phoneNumber:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  coupon:String,
  transactionId:String,
  transactionStatus:{
    type:String,
    required:true,
    required:true,
    enum:Object.values(paymentStatus),
    default:paymentStatus.PENDING
  },
  status:{
    type:String,
    enum:Object.values(orderStatus),
    default:orderStatus.PENDING
  }
},{
    timestamps:true
});
export const orderSchema=mongoose.model("order",order)