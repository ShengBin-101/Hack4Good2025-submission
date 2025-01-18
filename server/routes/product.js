import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import multer from "multer";

/* File Storage Setup */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* Router */
const router = express.Router();

/* Routes */
router.post("/", verifyToken, verifyAdmin, upload.single("productPicture"), createProduct); // Create Product
router.put("/:id", verifyToken, verifyAdmin, upload.single("productPicture"), updateProduct); // Update Product
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct); // Delete Product
router.get("/", verifyToken, getAllProducts); // Get All Products

export default router;