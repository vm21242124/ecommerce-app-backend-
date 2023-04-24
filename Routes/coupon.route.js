import express from 'express'
import {isLoggedIn} from '../Middleware/auth.middleware.js'
import { createCoupon, deleteCoupon, getAllActiveCoupons, updateCopoun } from '../Controllers/coupons.controller.js';

const router=express.Router();

router.post("/create",isLoggedIn,createCoupon)
router.get("/all",isLoggedIn,getAllActiveCoupons);
router.delete("/:id",isLoggedIn,deleteCoupon);
router.get("/active",getAllActiveCoupons);
router.put("/update/:id",isLoggedIn,updateCopoun)

export default router;