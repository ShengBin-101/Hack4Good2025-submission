import TaskCategory from '../models/TaskCategory.js';

export const createTaskCategory = async (req, res) => {
    try {
        const { name, voucherValue, description } = req.body;
        const newCategory = new TaskCategory({ name, voucherValue, description });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTaskCategories = async (req, res) => {
    try {
        const categories = await TaskCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTaskCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await TaskCategory.findById(categoryId);

        if (!category) {
            return res.status(404).json({ msg: "Task category not found." });
        }

        await TaskCategory.findByIdAndDelete(categoryId);

        res.status(200).json({ msg: "Task category has been deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};