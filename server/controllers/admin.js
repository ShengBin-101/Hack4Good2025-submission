import User from '../models/User.js';

export const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getExistingUsers = async (req, res) => {
    try {
        const existingUsers = await User.find({ status: { $ne: 'pending' } });
        res.status(200).json(existingUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User rejected and deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller to delete a user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};