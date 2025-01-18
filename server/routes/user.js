import express from "express";
import { getUserById, getVoucherCount } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

// Router setup
const router = express.Router();

/* ROUTES */
// Route to get user by userId (authenticated user can view their own data)
router.get("/:userId", verifyToken, getUserById);

// Route to get voucher count for the authenticated user
router.get("/:userId/voucher-count", verifyToken, getVoucherCount);

export default router;