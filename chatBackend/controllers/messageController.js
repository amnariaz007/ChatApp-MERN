const { response } = require('express');
const messageModel = require('../models/messageModel');
const { default: mongoose } = require('mongoose');
const {renameSync, mkdirSync } = require('fs')

// module.exports.getMessages = async (req, res) => {
//     try {

//         const user1 = req.body.id;
//         const user2 = req.body.id;

//         console.log("User1:", user1);
//         console.log("User2:", user2);

//         if (!user1 || !user2) {
//             return res.status(400).send("user required ");
//         }

//         const messages = await messageModel.find({
//             $or: [
//                 { sender: user1 },
//                 { recipient: user1 }
//             ]

//         }).sort({ timestamp: 1 })
//         console.log(messages, "messages")
//         return res.status(200).json({ messages })
//     } catch (err) {
//         console.log(err.message);
//         return response.status(500).send("internal server error")
//     }

// };

module.exports.getMessages = async (req, res) => {
    try {
        const { id, chatType } = req.body;

        if (!id || !chatType) {
            return res.status(400).send("User ID and chat type are required.");
        }

        let messages;
        if (chatType === "contact") {
            messages = await messageModel.find({
                $or: [
                    { sender: id },
                    { recipient: id }
                ]
            }).sort({ timestamp: 1 });
        } else if (chatType === "channel") {
            messages = await messageModel.find({
                channelId: id
            }).sort({ timestamp: 1 });
        } else {
            return res.status(400).send("Invalid chat type.");
        }

        console.log(messages, "messages");
        return res.status(200).json({ messages });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
};




module.exports.fileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("file is required ");
        }

        const date = Date.now();
        let fileDir = `uploads/files/${date}`
        let fileName = `${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir, {recursive: true})
        renameSync(req.file.path, fileName);


        return res.status(200).json({  filePath: fileName  })
    } catch (err) {
        console.log(err.message);
        return response.status(500).send("internal server error")
    }

};


