const userModel = require("../models/userModel");
const messageModel = require('../models/messageModel')



// Backend example
module.exports.DeleteAll = async (req, res) => {
  const { userId, deleteUserId } = req.body;

  try {
    // Update messages to add userId to the deletedFor array for each message
    await messageModel.updateMany(
      {
        $or: [
          { sender: userId, recipient: deleteUserId },
          { sender: deleteUserId, recipient: userId }
        ]
      },
      { $addToSet: { deletedFor: userId } } 
    );

    // Respond with success
    res.status(200).json({ message: "Chat deleted successfully from your side" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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


