import formidable from "formidable";
import { asyncHandler } from "../services/asyncHandler.js";
import mongoose from "mongoose";
import { productModel } from "../Models/Product.schema.js";
import fs from "fs";

import {  deleteImg,  getUrlObject, uploadImg } from "../Config/s3.config.js";

export const createProduct = asyncHandler(async (req, res) => {
  if(!req.user.role === "ADMIN"){
     return res.status(401).json("not allowed")
  }

  const form = formidable({
      multiples: true,
      keepExtensions: true
  })

  form.parse(req, async (err, fields, files) => {
      if(err) {
        return res.status(500).json("form parsing error")
      }
      // generating a unique productId
      let productId = new mongoose.Types.ObjectId().toHexString()

      // checking for input fields
      if(!fields.name ||
          !fields.price ||
          !fields.description ||
          !fields.collectionId ||
          !fields.stock) {
              return res.status(403).json("all fields are req")
          }
      // Promise.all() takes iterable of promises and return a single promise
      let imgUrlArrRes = Promise.all(
          // Object.values will return an array containing the values of the passed object
          Object.values(files).map(async(img, index) => {
              const imgData = fs.readFileSync(img.filepath)
              const upload = await uploadImg(
                  {
                      bucketname: process.env.S3_BUCKET_NAME,
                      key: `product/${productId}/img_${productId}_${index}`,
                      body: imgData,
                      contentType: img.mimetype
                      
                  }
              )
              return {
                  secure_url: upload.signedUrl,
              }
          })
      )

      let imgUrlArr = await imgUrlArrRes
      // add the product to db
      const product = await productModel.create({
          ...fields,
          _id: productId,
          photos: imgUrlArr
      })

      if(!product) {
          // if product is not created remove the images form s3 bucket

          const arrLength = Object.values(files).length
          for (let index = 0; index < arrLength; index++) {
              deleteImg({
                  bucketname: proccess.env.S3_BUCKET_NAME,
                  key: `product/${productId}/img_${index + 1}`
              })
              
          }
         return res.status(400).json("error in adding product")
          

          // in the image, we have provided the key dynamically - (index + 1 )
          // to achieve that we have to get the length of the files array 
          // loop till the length of the array to generate the keys

      }
      return res.status(200).json({
          status: true,
          product
      })
  })
})
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { property, value } = req.body;
  if (!(req.user.role === "ADMIN")) {
    return res.status(403).json("only admin have the access");
  }
  if (!(property && value)) {
    return res.status(401).json("all feild are required");
  }
  const product=await productModel.findById(id).populate("collectionId","name")
  if(!product){
    return res.status(400).json("product not found")
  }
  product[property]=value
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
          await deleteImg({
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
          const upload = await uploadImg({
            bucketname: process.env.S3_BUCKET_NAME,
            key: `produce/${id}/img_${id}_${i}`,
            body: imgData,
            contentType: img.mimetype,
          });
          return {
            secure_url: upload.signedUrl,
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
    await productModel.save();
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
  if (req.user.role !== "ADMIN") {
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

export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json("product not found");
  }
  res.status(200).json({
    success: true,
    product,
  });
});


export const updateSignedUrls = asyncHandler(async (req, res) => {
  if(req.user.role!=="ADMIN"){
    return res.status(401).json("you are not allowed")
  }
  const products = await productModel.find().sort({ createdAt: 'desc' });

  // Iterate over each product
  for (const product of products) {
    // Iterate over each photo in the product
    for (const photo of product.photos) {
      // Assuming photo._id contains the ID of the image
      const imageId = product._id

      // Convert the image ID to a string
      const imageIdString = imageId.toString();

      // Create an object with the bucketname and key
      const obje = {
        bucketname: process.env.S3_BUCKET_NAME,
        key: `product/${imageIdString}/img_${imageIdString}_0`,
      };

      // Generate the signed URL
      const signedUrl = await getUrlObject(obje);

      // Update the signedUrl field of the photo
      photo.signedUrl = signedUrl;
    }

    // Save the updated product
    await product.save();
  }
  res.status(200).json("updated all signed urls")
});
