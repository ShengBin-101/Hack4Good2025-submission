import mongoose from "mongoose";

const TaskCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        voucherValue: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

const TaskCategory = mongoose.model("TaskCategory", TaskCategorySchema);
export default TaskCategory;