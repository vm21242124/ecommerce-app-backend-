import express from "express";
import { createProduct } from "../Controllers/product.controller.js";
const router = express.Router();
router.post("/createproduct", createProduct);

export default router;
