import React, { createContext, useEffect, useRef, useContext } from 'react';
import { io } from "socket.io-client";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

// Create and export the context
export const SocketContext = createContext(null);

// Custom hook to access socket context
export const useSocket = () => useContext(SocketContext);

// Main provider component
export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo && !socket.current) {  // Only create socket if it doesn't exist yet
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            const handleRecieveMessage = (message) => {
                console.log("Message received by client:", message);
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
                if (
                    selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
                ) {
                    addMessage(message);
                }
            };

            const handleRecieveChannelMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
                if (
                    selectedChatType !== undefined &&
                    selectedChatData._id === message.channelId
                ) {
                    addMessage(message);
                }
            };

            socket.current.on("receiveMessage", (message) => {
                console.log("Received direct message:", message);
                handleRecieveMessage(message);
            });
            
            socket.current.on("receive-channel-message", (message) => {
                console.log("Received channel message:", message);
                handleRecieveChannelMessage(message);
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    socket.current = null;
                }
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current || null}>
        {children}
    </SocketContext.Provider>
    
    );
};
