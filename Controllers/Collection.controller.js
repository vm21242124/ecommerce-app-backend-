import { collectionModel } from "../Models/Collection.schema.js";
import { productModel } from "../Models/Product.schema.js";
import { asyncHandler } from "../services/asyncHandler.js";


export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(401).json("name is required to create collection");
  }
  const user = req.user;
  if (user.role === "ADMIN") {
    const collection = await collectionModel.create({ name });
    res
      .status(200)
      .json({ success: true, message: "collecttion created", collection });
  } else {
    return res.status(401).json("only admin can create collection");
  }
});
export const getCOllections = asyncHandler(async (req, res) => {
  const collections = await collectionModel.find({});
  if (collections.length) {
    res.status(200).json(collections);
  } else {
    res.status(401).json("no collection are in db");
  }
});

export const updateCollection = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user.role === "ADMIN") {
    return res.status(401).json("only admin have access to this route");
  }
  const { name } = req.body;
  const { id } = req.params;
  if (name && id) {
    const collection = await collectionModel.findById(id);
    if (collection) {
      collection.name = name;
      await collection.save();
      return res.status(200).json({
        success: true,
        message: "collection updated successfully",
        collection,
      });
    } else {
      return res.status(404).json("collection not found in db");
    }
  } else {
    return res.statu(401).json("all feilds are required");
  }
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user.role === "ADMIN") {
    return res.status(403).json("only admin have permission");
  }
  const { id } = req.params;
  if (id) {
    await collectionModel.findByIdAndDelete(id);
    return res.status(200).json("deleted successfully");
  } else {
    return res.status(401).json("provide id");
  }
});
export const getCOllectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id) {
    const collection = await collectionModel.findById(id);
    if (collection) {
      return res.status(200).json({
        success: true,
        message: "collection found",
        collection,
      });
    } else {
      return res.status(404).json("collection is not available");
    }
  } else {
    return res.status(401).json("provide id");
  }
});

export const getProductByCollectionId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productModel.find({ collectionId: id });
  if (!product) {
    return res.status(404).json("products are not available in collection");
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});
