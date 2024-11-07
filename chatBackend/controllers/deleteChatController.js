const userModel = require("../models/userModel");
const messageModel = require('../models/messageModel')



// Backend example
module.exports.DeleteAll = async (req, res) => {
  const { userId, deleteUserId } = req.body;
  console.log(userId, "userid")
  console.log(deleteUserId, "deleteUserId")

  try {
    
    const result = await messageModel.updateMany(
      {
        $or: [
          { sender: userId, recipient: deleteUserId },  // User sent messages to delete
          { sender: deleteUserId, recipient: userId }   // User received messages to delete
        ]
      },
      { $addToSet: { deletedFor: deleteUserId } } // Mark as deleted only for the logged-in user
    );

    console.log("Delete result:", result); 

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


