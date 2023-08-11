import express from 'express'
import { isLoggedIn } from '../Middleware/auth.middleware.js'
import { cancleOrder, editOrder, generateRazorpayOrderId, getAllorders, getKey, getOrder, getOrderStatus, getOrders, paymentVerification } from '../Controllers/order.controller.js'
const router=express.Router();
router.get('/getkey',getKey)
router.post('/checkout',generateRazorpayOrderId);
router.post('/paymentverification',paymentVerification);
router.get('/user',getOrders);
router.delete('/cancle/:orderId',cancleOrder);
router.get('/status',getOrderStatus)
router.get('/all',getAllorders)
router.get('/id/:id',getOrder)
router.put('/edit/:id',editOrder)
export default router