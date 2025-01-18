import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    voucherTransaction: {
      type: Number,
      required: true,
      min: 0
    },
    dateTransaction: {
      type: String,
      required: true,
    },
    timeTransaction: {
      type: String, // Store time as a string (e.g., "14:30")
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
