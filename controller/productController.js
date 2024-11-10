const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { uid, productName, description, price, place } = req.body;
    const imageUrl = req.file;

    if (!uid || !productName || !description || !price || !place || !imageUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(imageUrl.path);

    const newProduct = new Product({
        uid,
        productName,
        description,
        price,
        place,
        imageUrl: cloudinaryResponse.secure_url,
        cloudinaryId: cloudinaryResponse.public_id,
      });
  
      await newProduct.save();
      res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding the product.", error });
  }
};

const getLiveProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching products.", error });
  }
};

const getUserProducts = async (req,res) => {
  try{
    const {uid} = req.query;
    const products = await Product.find({uid : uid});
    res.status(200).json(products);
  }catch(error){
    res.status(500).json({ message: "An error occurred while fetching products.", error });
  }
}

module.exports = {
  addProduct,
  getLiveProducts,
  getUserProducts
};
