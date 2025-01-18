import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    description: {
      type: String,
      required: true,
      maxlength: 500, // Optional: Limits the description length
    },
    voucherNeeded: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative voucher count
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative stock quantity
    },
    productPicturePath: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;