const userModel = require("../models/userModel");
const messageModel = require('../models/messageModel')



module.exports.DeleteAll = async (req, res) => {
    try {
        const { userId, deleteUserId } = req.body;

        // Delete all messages between userId and deleteUserId
        const result = await messageModel.deleteMany({
            $or: [
                { sender: userId, recipient: deleteUserId },
                { sender: deleteUserId, recipient: userId }
            ]
        });

        console.log("Deleted messages count:", result.deletedCount);
        return res.status(200).json({ message: "All chat messages deleted successfully" });

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
};


// Unblock user
module.exports.DeleteOne = async (req, res) => {
    const { userId, blockedUserId } = req.body;

    try {
        const result = await userModel.findByIdAndUpdate(
            userId, {
            $pull: { blockedUsers: blockedUserId }
        },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("Updated User:", result); // Log the updated user document
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unblock user' });
    }
}


