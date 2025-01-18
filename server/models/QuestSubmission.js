import mongoose from "mongoose";

const QuestSubmissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quest",
            required: true,
        },
        proofImagePath: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "approved"],
        },
    },
    { timestamps: true }
);

const QuestSubmission = mongoose.model("QuestSubmission", QuestSubmissionSchema);

export default QuestSubmission;