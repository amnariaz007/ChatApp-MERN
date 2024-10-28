const { Server: SocketIOServer } = require("socket.io");
const messageModel = require('./models/messageModel');

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
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await messageModel.create(message);

        const messageData = await messageModel.findById(createMessage._id)
            .populate('sender', "id, email, firstname, lastname, color, image")
            .populate('recipient', "id, email, firstname, lastname, color, image");

            console.log("Message received on server:", messageData); 

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData)

        }


    }

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
        

        socket.on("disconnect", () => disconnect(socket));

    })


}

module.exports = setupSocket 