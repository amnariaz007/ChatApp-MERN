import React, { createContext,useEffect,useRef,   useContext } from 'react';
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
        if (userInfo) {
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
                    console.log("Message rcv:", message);
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

            socket.current.on("recieveMessage", handleRecieveMessage);
            socket.current.on("recieve-channel-Message", handleRecieveChannelMessage);

            return () => {
                socket.current.off("receiveMessage", handleRecieveMessage);
                socket.current.off("receive-channel-message", handleRecieveChannelMessage);
                socket.current.disconnect();
            };
            
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
