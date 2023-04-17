import express from "express";
import {
  createCollection,
  deleteCollection,
  getCOllectionById,
  getCOllections,
  getProductByCollectionId,
  updateCollection,
} from "../Controllers/Collection.controller";
import { isLoggedIn } from "../Middleware/auth.middleware";
const router = express.Router();
router.post("/create", isLoggedIn, createCollection);
router.get("/all", isLoggedIn, getCOllections);
router.post("/:id", isLoggedIn, updateCollection);
router.delete("/:id", isLoggedIn, deleteCollection);
router.get("/:id", isLoggedIn, getCOllectionById);
router.get("/products/:id", isLoggedIn, getProductByCollectionId);
export default router;
