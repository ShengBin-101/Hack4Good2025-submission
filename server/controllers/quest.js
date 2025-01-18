import Quest from "../models/Quest.js";

export const createQuest = async (req, res) => {
  try {
    const { name, description, voucherValue, cooldown } = req.body;
    const newQuest = new Quest({ name, description, voucherValue, cooldown, status: "available" });
    const savedQuest = await newQuest.save();
    res.status(201).json(savedQuest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find();
    res.status(200).json(quests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuest = async (req, res) => {
  try {
    const { questId } = req.params;

    const deletedQuest = await Quest.findByIdAndDelete(questId);
    if (!deletedQuest) {
      return res.status(404).json({ msg: "Quest not found." });
    }

    res.status(200).json({ msg: "Quest has been deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};