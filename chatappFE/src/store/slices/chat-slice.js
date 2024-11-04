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
    
    addMessage: (message) => {
        const { selectedChatMessages, selectedChatType, selectedChatData } = get();
    
        console.log("Adding message to Zustand state:", message);
        console.log("Current chat data:", selectedChatData);
    
        // Normalize sender and recipient IDs
        const messageRecipientId = message.recipient._id || message.recipient;
        const messageSenderId = message.sender._id || message.sender;
        const messageChannelId = message.channelId;
    
        // Check conditions based on chat type
        if (
            (selectedChatType === "channel" && messageChannelId === selectedChatData._id) ||
            (selectedChatType === "contact" && 
             (messageRecipientId === selectedChatData._id || messageSenderId === selectedChatData._id))
        ) {
            set({
                selectedChatMessages: [
                    ...selectedChatMessages,
                    {
                        ...message,
                        recipient: messageRecipientId,
                        sender: messageSenderId,
                    }
                ]
            });
        } else {
            console.warn("Message not added: channelId or IDs do not match.");
        }
    }
    
    
    
    
    
})