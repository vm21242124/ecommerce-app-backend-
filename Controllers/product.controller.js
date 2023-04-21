import formidable from "formidable";
import { asyncHandler } from "../services/asyncHandler.js";
import mongoose from "mongoose";
import { productModel } from "../Models/Product.schema.js";
import fs from "fs";
import { s3FileUpload, s3deleteFile } from "../services/Filehandling.js";

export const createProduct = asyncHandler(async (req, res) => {
  if (!req.user.role === "ADMIN") {
    return res.status(401).json("only admin can access this route");
  }
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json(err);
    }
    //generating unique id for new product
    let productId = new mongoose.Types.ObjectId().toHexString();
    if (!(fields.name || fields.price || fields.collectionId || fields.stock)) {
      return res.status(403).json("all fields are required");
    }
    const now = new Date();
    let imgUrlArrRes = Promise.all(
      Object.values(files).map(async (img, index) => {
        const imgData = fs.readFileSync(img.filepath);
        const upload = await s3FileUpload({
          bucketname: process.env.S3_BUCKET_NAME,
          key: `product/${productId}/img_${now.getTime()}_${index}`,
          body: imgData,
          contentType: img.mimetype,
        });
        console.log(upload.Location);
        return {
          secure_url: upload.Location,
        };
      })
    );
    let imgUrlArr = await imgUrlArrRes;
    const product = await productModel.create({
      ...fields,
      _id: productId,
      photos: imgUrlArr,
    });
    if (!product) {
      const arrLength = Object.values(files).length;
      for (let idx = 0; idx < arrLength; idx++) {
        s3deleteFile({
          bucketname: process.env.S3_BUCKET_NAME,
          key: `product/img_${idx + 1}`,
        });
      }
      return res.status(400).json("error in adding product");
    }
    return res.status(200).json({
      success: true,
      product,
    });
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { property, value } = req.body;
  if (!(req.user.role === "ADMIN")) {
    return res.status(403).json("only admin have the access");
  }
  if (!(property && value)) {
    return res.status(401).json("all feild are required");
  }
  const updatedproduct = await product.save();
  if (!updatedproduct) {
    return res.status(404).json("error to save the product");
  }
  res.status(200).json({
    success: true,
    updatedproduct,
  });
});
export const updateProductimg = asyncHandler(async (req, res) => {
  if (!(req.user.role === "ADMIN")) {
    return res.status(403).json("only admin have the access");
  }
  const { id } = req.params;
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });
  let imgUrlArr = [];
  form.parse(req, async (err, feilds, files) => {
    if (err) {
      return res.status(500).json("error in form parsing");
    }
    const removedImgarr = JSON.parse(feilds.removedimg);
    if (removedImgarr.length) {
      await Promise.all(
        removedImgarr.map(async (item) => {
          let url = item.secure_url;
          let pathName = new URL(url).pathname;
          let finalkey = pathName.substring(pathName.indexOf("product"));
          console.log(finalkey);
          await s3deleteFile({
            bucketname: process.env.S3_BUCKET_NAME,
            key: finalkey,
          });
        })
      );
    }
    let imgFiles = Object.values(files);
    if (imgFiles.length) {
      const now = new Date();
      imgUrlArr = await Promise.all(
        imgFiles.map(async (img, i) => {
          const imgData = fs.readFileSync(img.filepath);
          const upload = await s3FileUpload({
            bucketname: process.env.S3_BUCKET_NAME,
            key: `produce/${id}/img_${now.getTime()}_${i}`,
            body: imgData,
            contentType: img.mimetype,
          });
          return {
            secure_url: upload.Location,
          };
        })
      );
    }
    const product = await productModel
      .findById(id)
      .populate("collectionId", "name");
    let result = removedImgarr.length ? [] : product.photos;
    if (removedImgarr.length) {
      let previousImg = product.photos;
      result = previousImg.filter((img) => {
        let index = removedImgarr.findIndex((item) => {
          item.secure_url === img.secure_url;
        });
        return index === -1;
      });
    }
    product.photos = [...result, ...imgUrlArr];
    await product.save();
    if (!product) {
      return res.status(401).json("error to save the img");
    }
    return res.status(200).json({
      success: true,
      product,
    });
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const product = await productModel.find().sort({ createdAt: "desc" });
  if (!product) {
    return res.status(400).json("no product found");
  }
  return res.status(200).json({
    success: true,
    product,
  });
});
export const getLimitedProduct = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skipcount = (page - 1) * limit;
  const products = await productModel.find().skip(skipcount).limit(limit);
  if (!products) {
    return res.status(400).json("no product found");
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getProductByCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.page) || 12;
  const skipcount = (page - 1) * limit;
  if (!categoryId) {
    return res.status(401).json("please provide category id");
  }
  const products = await productModel
    .find({ collectionId: categoryId })
    .skip(skipcount)
    .limit(limit);
  if (!products) {
    return res.status(400).json("no product in category");
  }
  return res.status(200).json({
    success: true,
    products,
  });
});
export const getSearchedProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return req.status(401).json("please provide query");
  }
  const regex = new RegExp(q, "i");
  const products = await productModel.find({
    name: { $regex: regex },
  });
  console.log(q);
  if (!products.length) {
    return res.status(404).json("no product found in db");
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return req.status(401).json("please provide id");
  }
  if (!req.user.role === "ADMIN") {
    return res.status(401).json("you are not allowed to this route");
  }
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return res.status(401).json("product not deleted");
  }
  res.status(200).json({
    success: true,
    product,
  });
});
