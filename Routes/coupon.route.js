import express from 'express'
import {isLoggedIn} from '../Middleware/auth.middleware.js'
import { createCoupon, deleteCoupon, getAllActiveCoupons, updateCopoun } from '../Controllers/coupons.controller.js';

const router=express.Router();

router.post("/create",createCoupon)
router.get("/all",getAllActiveCoupons);
router.delete("/:id",deleteCoupon);
router.get("/active",getAllActiveCoupons);
router.put("/update/:id",updateCopoun)

export default router;