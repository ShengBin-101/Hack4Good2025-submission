import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

import {
  createTask,
  approveTask,
  getAllTasks,
  getUserTasks,
  deleteTask
} from "../controllers/task.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

// Ensure the directory for assets exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, "..", "public", "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, assetsDir); // Store files in 'public/assets'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save files with their original names
  },
});

const upload = multer({ storage });

/* ROUTER SETUP */
const router = express.Router();

/* ROUTES */
// User creates a task with a picture
router.post("/", verifyToken, upload.single("picture"), createTask);

// Admin approves/rejects a task
router.put("/:taskId/approve", verifyToken, verifyAdmin, approveTask);

// Admin gets all tasks
router.get("/", verifyToken, verifyAdmin, getAllTasks);

// User gets their tasks
router.get("/:userId", verifyToken, getUserTasks);

// User deletes their own task
router.delete("/:taskId", verifyToken, deleteTask);

export default router;
