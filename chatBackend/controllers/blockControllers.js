const express = require('express');
const userModel = require("../models/userModel");



// Block user
module.exports.Block = async (req, res) => {
    const { userId, blockedUserId } = req.body;

    try {
        await userModel.findByIdAndUpdate(userId, {
            $addToSet: { blockedUsers: blockedUserId }
        });
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to block user' });
    }
}

// Unblock user
module.exports.Unblock = async (req, res) => {
    const { userId, blockedUserId } = req.body;

    try {
        await userModel.findByIdAndUpdate(userId, {
            $pull: { blockedUsers: blockedUserId }
        });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unblock user' });
    }
}

module.exports = router;
