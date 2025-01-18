import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500,
        },
        voucherValue: {
            type: Number,
            required: true,
            min: 0,
        },
        cooldown: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            default: "available",
            enum: ["available", "cooldown"],
        },
    },
    { timestamps: true }
);

const Quest = mongoose.model("Quest", QuestSchema);

export default Quest;