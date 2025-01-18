import User from "../models/User.js";

/* GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Return the full user document (including the encrypted password)
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET VOUCHER COUNT */
export const getVoucherCount = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Return the voucher count
    res.status(200).json({ voucherCount: user.voucher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
