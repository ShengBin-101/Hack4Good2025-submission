import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { createQuestSubmission, getQuestSubmissions, getUserQuestSubmissions, approveQuestSubmission, rejectQuestSubmission, deletePendingQuestSubmission } from "../controllers/questSubmission.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs";

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

const router = express.Router();

router.post("/", verifyToken, upload.single("proofImage"), createQuestSubmission);
router.get("/", verifyToken, verifyAdmin, getQuestSubmissions);
router.get("/:userId", verifyToken, getUserQuestSubmissions);
router.put("/:submissionId/approve", verifyToken, verifyAdmin, approveQuestSubmission);
router.delete("/:submissionId", verifyToken, verifyAdmin, rejectQuestSubmission);
router.delete("/pending/:submissionId", verifyToken, deletePendingQuestSubmission);

export default router;