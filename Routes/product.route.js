import express from "express";
import { updateSignedUrls, createProduct, deleteProduct, getAllProducts, getLimitedProduct, getProductByCategory, getProductById, getSearchedProducts,  updateProduct, updateProductimg } from "../Controllers/product.controller.js";
import { isLoggedIn } from "../Middleware/auth.middleware.js";
const router = express.Router();

router.get('/id/:productId',getProductById)
router.get("/updateallurls",updateSignedUrls)
router.get("/all",getAllProducts);
router.get('/search',getSearchedProducts);
router.get('/list',getLimitedProduct);
router.get("/:categoryId",getProductByCategory);
router.post("/create",createProduct);
router.put("/update/:id",updateProduct);
router.put('/updatephotos',updateProductimg);
router.delete('/delete/:id',deleteProduct)




export default router;
