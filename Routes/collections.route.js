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
router.get("/all", getCOllections);
router.get("/:id",  getCOllectionById);
router.get("/products/:id",  getProductByCollectionId);

//post request 

router.post("/create",  createCollection);
router.post("/update/:id", updateCollection);

//delete requests
router.delete("/delete/:id",  deleteCollection);

export default router;
