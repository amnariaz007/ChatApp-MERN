const { Server: SocketIOServer } = require("socket.io");
const messageModel = require('./models/messageModel');
const channelModel = require('./models/ChannelModel');
const userModel = require('./models/userModel')

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId)
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        console.log("Processing message:", message); 

        // const sender = await userModel.findById(message.sender);
        // if (!sender) throw new Error("Sender not found");

        // if (sender.blockedUsers.includes(message.recipient)) {
        //     console.log("Recipient is blocked by sender. Message not sent.");
        //     return;
        // }

        const sender = await userModel.findById(message.sender);
        const recipient = await userModel.findById(message.recipient);
    
        // Check if either user has blocked the other
        const isBlockedBySender = sender.blockedUsers.includes(message.recipient);
        const isBlockedByRecipient = recipient.blockedUsers.includes(message.sender);
    
        if (isBlockedBySender || isBlockedByRecipient) {
            console.log("Message blocked due to block status.");
            return; // Exit early to prevent sending the message
        }

        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient);



        const createMessage = await messageModel.create(message);

        const messageData = await messageModel.findById(createMessage._id)
            .populate('sender', "id, email, firstname, lastname, color, image")
            .populate('recipient', "id, email, firstname, lastname, color, image");

            console.log("Message received on server:", messageData); 

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData)

        }


    }


    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl, timestamp } = message;
    
        const createdMessage = await messageModel.create({
            sender,
            recipient: null, // No recipient for channel messages
            content,
            messageType,
            timestamp,
            fileUrl
        });
    
        const messageData = await messageModel.findById(createdMessage._id)
            .populate("sender", "id email firstname lastname image color")
            .exec();
    
        await channelModel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id }
        });
    
        const channel = await channelModel.findById(channelId).populate("members");
    
        const finalData = { ...messageData._doc, channelId: channel._id };
    
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receive-channel-message", finalData); // Correct event name
                }
            });
    
            // Emit to the channel admin
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) { // Correct variable here
                io.to(adminSocketId).emit("receive-channel-message", finalData); // Correct event name
            }
        }
    };
    

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`user connected : ${userId} with this socket ${socket.id}`)
        } else {
            console.log("user id not provided during connection")
        }

        socket.on("sendMessage", (message) => {
            console.log("Message received on server:", message); // <-- Add this line
            sendMessage(message);
        });
        

        socket.on("send-channel-Message", (message) => {
            console.log("Message received on server:", message); // <-- Add this line
            sendChannelMessage(message);
        });   
        
        socket.on("disconnect", () => disconnect(socket));

    })


}

module.exports = setupSocket 