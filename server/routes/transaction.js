import express from "express";
import {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  approveTransaction,
  rejectTransaction,
} from "../controllers/transaction.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* CREATE TRANSACTION */
router.post("/", verifyToken, createTransaction);

/* GET TRANSACTIONS FOR A SPECIFIC USER */
router.get("/user/:userId", verifyToken, getUserTransactions);

/* GET ALL TRANSACTIONS (Admin) */
router.get("/", verifyToken, verifyAdmin, getAllTransactions);

/* APPROVE TRANSACTION */
router.put("/:transactionId/approve", verifyToken, verifyAdmin, approveTransaction);

/* REJECT TRANSACTION */
router.delete("/:transactionId/reject", verifyToken, verifyAdmin, rejectTransaction);

export default router;
