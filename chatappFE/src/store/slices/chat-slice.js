export const createChatSlice = (set, get) =>({
    selectedChatType : undefined,
    selectedChatData : undefined,
    selectedChatMessages : [],
    directMessagesContacts: [],
    channels: [],
    setChannels : (channels) => set({ channels }),
    setSelectedChatType: (selectedChatType)=> set({selectedChatType}),
    setSelectedChatData: (selectedChatData)=> set({selectedChatData}),
    setSelectedChatMessages: (selectedChatMessages) => set({selectedChatMessages}),
    setDirectMessagesContacts:  (directMessagesContacts) => set({directMessagesContacts}),
    addChannel: (channel)=>{
        const channels = get().channels;
        set({channels: [channel,...channels ]})
    },
    closeChat: ()=>  set({
        selectedChatType : undefined,
    selectedChatData : undefined,
    selectedChatMessages : [],
    }),
    // addMessage: (message) => {
    //     const { selectedChatMessages, selectedChatType, selectedChatData } = get();
        
    //     console.log("Adding message to Zustand state:", message);  // Debugging log
    //     console.log("Current chat data:", selectedChatData);  // Debugging log
    
    //     if (
    //         (selectedChatType === "channel" && message.channelId === selectedChatData._id) ||
    //         (selectedChatType === "contact" && (message.recipient === selectedChatData._id || message.sender === selectedChatData._id))
    //     ) {
    //         set({
    //             selectedChatMessages: [
    //                 ...selectedChatMessages,
    //                 {
    //                     ...message,
    //                     recipient: selectedChatType === "channel" ? message.channelId : message.recipient._id || message.recipient,
    //                     sender: message.sender._id || message.sender,
    //                 }
    //             ]
    //         });
    //     }
    // }
    addMessage: (message) => {
        const { selectedChatMessages, selectedChatType, selectedChatData } = get();
    
        console.log("Adding message to Zustand state:", message);
        console.log("Current chat data:", selectedChatData);
    
        if (
            (selectedChatType === "channel" && message.channelId === selectedChatData._id) ||
            (selectedChatType === "contact" && (message.recipient === selectedChatData._id || message.sender === selectedChatData._id))
        ) {
            set({
                selectedChatMessages: [
                    ...selectedChatMessages,
                    {
                        ...message,
                        recipient: selectedChatType === "channel" ? message.channelId : message.recipient._id || message.recipient,
                        sender: message.sender._id || message.sender,
                    }
                ]
            });
        } else {
            console.warn("Message not added: channelId or IDs do not match.");
        }
    }
    
    
    
    
})