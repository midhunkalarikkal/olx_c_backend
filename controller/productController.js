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

const updateProduct = async (req, res) => {
  try {
    const { uid, productName, description, price, place } = req.body;
    const { _id } = req.query;

    if (!uid || !productName || !description || !price || !place || !_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    
    let imageUrl = existingProduct.imageUrl;
    let cloudinaryId = existingProduct.cloudinaryId;
    
    if (req.file) {
      if (cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(cloudinaryId);
        } catch (deleteError) {
          return res.status(500).json({ message: "Cloudinary error, please try again." });
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
      imageUrl = cloudinaryResponse.secure_url;
      cloudinaryId = cloudinaryResponse.public_id;
    }

    const updatedProduct = {
      productName,
      description,
      price,
      place,
      imageUrl,
      cloudinaryId,
    };

    const result = await Product.findByIdAndUpdate(_id, updatedProduct, { new: true });

    console.log("result:", result);

    if (result) {
      return res.status(200).json({
        message: "Product updated successfully.",
        updatedProduct: result,
      });
    } else {
      return res.status(500).json({
        message: "Error updating product.",
      });
    }

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "An error occurred while updating the product.", error });
  }
};



module.exports = {
  addProduct,
  getLiveProducts,
  getUserProducts,
  updateProduct
};
