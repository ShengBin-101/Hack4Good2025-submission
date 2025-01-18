import Product from "../models/Product.js";

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
  try {
    const { name, description, voucherNeeded, stockQuantity } = req.body;
    const productPicturePath = req.file ? req.file.filename : null; // Get file path from Multer

    if (!productPicturePath) {
      return res.status(400).json({ error: "Product picture is required." });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      productPicturePath, // Save the filename
      voucherNeeded,
      stockQuantity,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, voucherNeeded, stockQuantity } = req.body;
    const productPicturePath = req.file ? req.file.filename : undefined; // Check if new file is uploaded

    const updates = {
      ...(name && { name }),
      ...(description && { description }),
      ...(voucherNeeded && { voucherNeeded }),
      ...(stockQuantity && { stockQuantity }),
      ...(productPicturePath && { productPicturePath }), // Include the picture path if a new file is uploaded
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
    });

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found." });
    }

    res.status(200).json({ msg: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL PRODUCTS */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};