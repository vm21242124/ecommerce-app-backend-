import express from "express";
import { updateSignedUrls, createProduct, deleteProduct, getAllProducts, getLimitedProduct, getProductByCategory, getProductById, getSearchedProducts,  updateProduct, updateProductimg } from "../Controllers/product.controller.js";
import { isLoggedIn } from "../Middleware/auth.middleware.js";
const router = express.Router();

router.get('/id/:productId',getProductById)
router.get("/updateallurls",isLoggedIn,updateSignedUrls)
router.get("/all",getAllProducts);
router.get('/search',getSearchedProducts);
router.get('/list',getLimitedProduct);
router.get("/:categoryId",getProductByCategory);
router.post("/create",isLoggedIn,createProduct);
router.put("/update/:id",isLoggedIn,updateProduct);
router.put('/updatephotos',isLoggedIn,updateProductimg);
router.delete('/delete/:id',isLoggedIn,deleteProduct)




export default router;
