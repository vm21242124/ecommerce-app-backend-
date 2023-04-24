import express from 'express'
import { isLoggedIn } from '../Middleware/auth.middleware.js'
import { cancleOrder, editOrder, generateRazorpayOrderId, getAllorders, getKey, getOrder, getOrderStatus, getOrders, paymentVerification } from '../Controllers/order.controller.js'
const router=express.Router();
router.get('/getkey',isLoggedIn,getKey)
router.post('/checkout',isLoggedIn,generateRazorpayOrderId);
router.post('/paymentverification',isLoggedIn,paymentVerification);
router.get('/user/all',isLoggedIn,getOrders);
router.delete('/cancle/:orderId',isLoggedIn,cancleOrder);
router.get('/status',isLoggedIn,getOrderStatus)
router.get('/all',isLoggedIn,getAllorders)
router.get('/id/:id',isLoggedIn,getOrder)
router.put('/edit/:id',isLoggedIn,editOrder)
export default router