import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";

/* CREATE TRANSACTION */
export const createTransaction = async (req, res) => {
  try {
    const { userId, productName, productQuantity, dateTransaction, timeTransaction } = req.body;

    // Find the user and product
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ msg: "Product not found." });
    }

    // Calculate total vouchers required
    const voucherTransaction = product.voucherNeeded * productQuantity;

    // Check if user has enough vouchers
    if (user.voucher < voucherTransaction) {
      return res.status(400).json({ msg: "Insufficient vouchers." });
    }

    // Check if product has enough stock
    if (product.stockQuantity < productQuantity) {
      return res.status(400).json({ msg: "Insufficient product stock." });
    }

    // Deduct vouchers from user and update product stock
    user.voucher -= voucherTransaction;
    product.stockQuantity -= productQuantity;

    await user.save();
    await product.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      userId,
      productName,
      productQuantity,
      voucherTransaction,
      dateTransaction,
      timeTransaction,
      status: "pending", // Default status
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* APPROVE TRANSACTION */
export const approveTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found." });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    transaction.status = "approved";
    await transaction.save();

    // Send email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Order Approved',
      text: `Your order for ${transaction.productName} has been approved. You can collect it the following day.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Transaction approved and email sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* REJECT TRANSACTION */
export const rejectTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found." });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Refund vouchers to user
    user.voucher += transaction.voucherTransaction;
    await user.save();

    transaction.status = "rejected";
    await transaction.save();

    // Send email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Order Rejected',
      text: `Your order for ${transaction.productName} has been rejected. The voucher value has been refunded to your account.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Transaction rejected, vouchers refunded, and email sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET USER TRANSACTIONS */
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ msg: "No transactions found for this user." });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL TRANSACTIONS (Admin) */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ msg: "No transactions found." });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
