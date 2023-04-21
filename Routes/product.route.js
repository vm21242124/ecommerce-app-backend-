import express from "express";
import { createProduct } from "../Controllers/product.controller.js";
import { isLoggedIn } from "../Middleware/auth.middleware.js";
const router = express.Router();
router.post("/create", isLoggedIn,createProduct);

export default router;
