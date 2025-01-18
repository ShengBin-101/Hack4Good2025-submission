import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { createTaskCategory, getTaskCategories, deleteTaskCategory } from '../controllers/taskCategory.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createTaskCategory);
router.get('/', verifyToken, getTaskCategories);
router.delete('/:categoryId', verifyToken, verifyAdmin, deleteTaskCategory);

export default router;