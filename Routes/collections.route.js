import express from "express";
import {
  createCollection,
  deleteCollection,
  getCOllectionById,
  getCOllections,
  getProductByCollectionId,
  updateCollection,
} from "../Controllers/Collection.controller.js";
import { isLoggedIn } from "../Middleware/auth.middleware.js";
const router = express.Router();
//get request 
router.get("/all", isLoggedIn, getCOllections);
router.get("/:id", isLoggedIn, getCOllectionById);
router.get("/products/:id", isLoggedIn, getProductByCollectionId);

//post request 

router.post("/create", isLoggedIn, createCollection);
router.post("/update/:id", isLoggedIn, updateCollection);

//delete requests
router.delete("/delete/:id", isLoggedIn, deleteCollection);

export default router;
