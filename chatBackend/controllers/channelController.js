const userModel = require("../models/userModel");
const ChannelModel = require("../models/ChannelModel");
const mongoose = require('mongoose')



module.exports.createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = new mongoose.Types.ObjectId(req.user._id);

        console.log("Received name:", name);
        console.log("Received members:", members);
        console.log("User ID:", userId);

        // Check for admin
        const admin = await userModel.findById(userId);
        if (!admin) {
            return res.status(400).send("Admin not found");
        }

        // Validate members
        const validMembers = await userModel.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members aren't valid users");
        }

        // Create and save channel
        const Channel = new ChannelModel({
            name,
            members,
            admin: userId,
        });

        await Channel.save();

        return res.status(200).json({ channel: Channel });
    } catch (err) {
        console.error("Error in createChannel:", err.message);
        res.status(500).send("Server error");
    }
};


module.exports.GetUserChannel = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.user._id);
        console.log(userId, "IDForChannel")
        const channel = await ChannelModel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatedAt: -1 })

        console.log(channel, "chanel")

        return res.status(200).json({ channel })
    } catch (err) {
        console.log(err.message)
    }
}