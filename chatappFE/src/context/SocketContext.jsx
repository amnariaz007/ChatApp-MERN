import React, { createContext, useEffect, useRef, useContext } from 'react';
import { io } from "socket.io-client";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const { userInfo, selectedChatData, selectedChatType, addMessage } = useAppStore();

    useEffect(() => {
        if (userInfo && !socket.current) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            // Direct message handler
            const handleReceiveMessage = (message) => {
                console.log("Direct message received:", message);
                if (
                    selectedChatType === "contact" &&
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
                ) {
                    addMessage(message);
                }
            };

            // Channel message handler
            const handleReceiveChannelMessage = (message) => {
                console.log("Channel message received:", message);
                if (selectedChatType === "channel" && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }
            };

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receive-channel-message", handleReceiveChannelMessage);

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    socket.current = null;
                }
            };
        }
    }, [userInfo, selectedChatData, selectedChatType, addMessage]);

    return (
        <SocketContext.Provider value={socket.current || null}>
            {children}
        </SocketContext.Provider>
    );
};
