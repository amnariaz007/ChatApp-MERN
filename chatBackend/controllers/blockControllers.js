const userModel = require("../models/userModel");



// Block user
module.exports.Block = async (req, res) => {
    const { userId, blockedUserId } = req.body;
    console.log("User ID:", userId);
    console.log("Blocked User ID:", blockedUserId);


    try {
        const result = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { blockedUsers: blockedUserId } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("Updated User:", result); // Log the updated user document
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to block user' });
    }
}

// Unblock user
module.exports.Unblock = async (req, res) => {
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


