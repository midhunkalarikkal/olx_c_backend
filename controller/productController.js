const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { uid, productName, description, price, place } = req.body;
    const imageUrl = req.file;

    if (!uid || !productName || !description || !price || !place || !imageUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newProduct = new Product({
      uid,
      productName,
      description,
      price,
      place,
      imageUrl: imageUrl.path,
      cloudinaryId: imageUrl.filename,
    });

    await newProduct.save();
    res
      .status(200)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while adding the product.", error });
  }
};

const getLiveProducts = async (req, res) => {
  try {
    const { uid } = req.query;
    let products;
    if(uid){
      products = await Product.find({uid : {$ne : uid}});
    }else{
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching products.", error });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const { uid } = req.query;
    const products = await Product.find({ uid: uid });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching products.", error });
  }
};

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
          return res
            .status(500)
            .json({ message: "Cloudinary error, please try again." });
        }
      }

      imageUrl = req.file.path;
      cloudinaryId = req.file.filename;
    }

    const updatedProduct = {
      productName,
      description,
      price,
      place,
      imageUrl,
      cloudinaryId,
    };

    const result = await Product.findByIdAndUpdate(_id, updatedProduct, {
      new: true,
    });

    if (result) {
      return res.status(200).json({
        message: "Product updated successfully.",
        updatedProduct: result,
      });
    } else {
      return res.status(400).json({
        message: "Error updating product.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while updating the product.",
        error,
      });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const _id = req.query;
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const cloudinaryId = product.cloudinaryId;
    if (cloudinaryId) {
      await cloudinary.uploader.destroy(cloudinaryId);
    }

    const result = await Product.findByIdAndDelete(_id);

    if (result) {
      return res.status(200).json({
        message: "Product deleted successfully.",
        deletedProduct: result,
      });
    } else {
      return res.status(400).json({
        message: "Error deleting product.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the product.",
        error,
      });
  }
};

module.exports = {
  addProduct,
  getLiveProducts,
  getUserProducts,
  updateProduct,
  deleteProduct,
};
