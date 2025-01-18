import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
      trim: true, // Removes extra spaces
    },
    taskDescription: {
      type: String,
      required: true,
      maxlength: 500, // Limits the description length
    },
    voucherRequest: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative quantity
    },
    dateCompleted: {
      type: String,
      required: true,
    },
    taskPicturePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;