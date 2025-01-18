import QuestSubmission from "../models/QuestSubmission.js";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

export const createQuestSubmission = async (req, res) => {
    try {
        const { userId, questId } = req.body;
        const proofImagePath = req.file ? req.file.filename : null; // Save only the filename

        if (!proofImagePath) {
            return res.status(400).json({ msg: "Proof image is required." });
        }

        const newQuestSubmission = new QuestSubmission({ userId, questId, proofImagePath });
        const savedQuestSubmission = await newQuestSubmission.save();
        res.status(201).json(savedQuestSubmission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getQuestSubmissions = async (req, res) => {
    try {
        const questSubmissions = await QuestSubmission.find({ status: "pending" }).populate('userId').populate('questId');
        res.status(200).json(questSubmissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserQuestSubmissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const questSubmissions = await QuestSubmission.find({ userId }).populate('questId');
        res.status(200).json(questSubmissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePendingQuestSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const questSubmission = await QuestSubmission.findById(submissionId);

        if (!questSubmission) {
            return res.status(404).json({ msg: "Quest submission not found." });
        }

        if (questSubmission.status !== "pending") {
            return res.status(400).json({ msg: "Only pending submissions can be deleted." });
        }

        await QuestSubmission.findByIdAndDelete(submissionId);

        res.status(200).json({ msg: "Pending quest submission deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const approveQuestSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const questSubmission = await QuestSubmission.findById(submissionId).populate('userId').populate('questId');

        if (!questSubmission) {
            return res.status(404).json({ msg: "Quest submission not found." });
        }

        const quest = await Quest.findById(questSubmission.questId);
        const user = await User.findById(questSubmission.userId);

        if (!quest || !user) {
            return res.status(404).json({ msg: "Quest or user not found." });
        }

        user.voucher += quest.voucherValue;
        await user.save();

        if (quest.cooldown === 0) {
            await Quest.findByIdAndDelete(quest._id);
        } else {
            quest.status = "cooldown";
            await quest.save();

            // Set a timeout to flip the quest status back to available after the cooldown period
            setTimeout(async () => {
                quest.status = "available";
                await quest.save();
            }, quest.cooldown * 60 * 1000); // Convert cooldown from minutes to milliseconds
        }

        questSubmission.status = "approved";
        await questSubmission.save();

        res.status(200).json({ msg: "Quest submission approved and processed." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const rejectQuestSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const questSubmission = await QuestSubmission.findById(submissionId);

        if (!questSubmission) {
            return res.status(404).json({ msg: "Quest submission not found." });
        }

        await QuestSubmission.findByIdAndDelete(submissionId);

        res.status(200).json({ msg: "Quest submission rejected and deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};