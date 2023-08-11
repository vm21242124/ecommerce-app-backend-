import { collectionModel } from "../Models/Collection.schema.js";
import { productModel } from "../Models/Product.schema.js";
import CustomError from "../Utils/cutomError.js";
import { asyncHandler } from "../services/asyncHandler.js";

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError("name is required to create collection", 401);
  }

  const collection = await collectionModel.create({ name });
  res
    .status(200)
    .json({ success: true, message: "collecttion created", collection });
});

export const getCOllections = asyncHandler(async (req, res) => {
  const collections = await collectionModel.find({});
  if (collections.length) {
    return res.status(200).json(collections);
  } else {
    throw new CustomError("no collection are in db", 404);
  }
});

export const updateCollection = asyncHandler(async (req, res) => {

  const { name } = req.body;
  const { id } = req.params;
  if (!(name || id)) {
    throw new CustomError("all feilds are required", 401);
  }

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
    throw new CustomError("collection not found in db", 404);
  }
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError("provide id", 403);
  }

  await collectionModel.findByIdAndDelete(id);
  return res.status(200).json("deleted successfully");
});
export const getCOllectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError("provide id", 401);
  }
  const collection = await collectionModel.findById(id);
  if (collection) {
    return res.status(200).json({
      success: true,
      message: "collection found",
      collection,
    });
  } else {
    throw new CustomError("collection is not available", 404);
  }
});

export const getProductByCollectionId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productModel.find({ collectionId: id });
  if (!product) {
    throw new CustomError("products are not available in collection", 404);
  }
  res.status(200).json({
    success: true,
    product,
  });
});
