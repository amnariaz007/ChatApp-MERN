import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useSocket } from '@/context/SocketContext'
import { useAppStore } from '@/store'
import { apiClient } from '@/lib/api-client'
import {FILE_UPLOAD} from '@/utils/constants'
import { MdKeyboardVoice } from "react-icons/md";
import { toast } from 'sonner'



const MessageBar = () => {

  const fileInputRef = useRef();
  const emojiRef = useRef();
  const socket = useSocket();
  //console.log("Socket in MessageBar:", socket);
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const [message, setmessage] = useState("");
  const [emojiPickerOpenClose, setemojiPickerOpenClose] = useState(false);

  const HandleEmojiPicker = (emoji) => {
    setmessage((msg) => msg + emoji.emoji);

  }

  
 


const HandlesendMessage = async () => {
  console.log("Socket:", socket);

  if (socket && socket.connected) {
      console.log("Sending message:", message);

      if (selectedChatType === "contact") {
          const blockedUsers = userInfo.blockedUsers || []; // Ensure it's an array

          if (blockedUsers.includes(selectedChatData._id)) {
              toast.error("You have been blocked by this user and cannot send messages.");
              return;
          }
          const payload = {
              sender: userInfo.id,
              content: message,
              recipient: selectedChatData._id,
              messageType: "text",
          };
          console.log("Payload:", payload);
          socket.emit("sendMessage", payload);
      } else if (selectedChatType === "channel") {
          const payload = {
              sender: userInfo.id,
              content: message,
              messageType: "text",
              channelId: selectedChatData._id,
          };

          console.log("Payload:", payload);
          socket.emit("send-channel-Message", payload);
      }

      setmessage("");
  } else {
      console.error("Socket not connected or initialized.");
  }
};





  const hadleFileInputclick = () => {
    if(fileInputRef.current){
      fileInputRef.current.click();
    }

  }

  const handleAttachementChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
     
      try {
        const response = await apiClient.post(FILE_UPLOAD, formData);
        console.log("Uploaded file path:", response.data.filePath); // Check the file URL here
        if (response.status === 200 && response.data.filePath) {
          if(selectedChatData === "contact"){

            socket.emit("sendMessage", {
              sender: userInfo.id,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,  // Ensure fileUrl is present
            });
          } else if ( selectedChatType === "channel"){
            socket.emit("send-channel-Message", {
              sender: userInfo.id,
              content: message,
              messageType: "file",
              fileUrl: response.data.filePath, 
              channelId: selectedChatData._id,
          });
          }
          
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  
  const hadleVoiceNotek = async () =>{
    
  }


  useEffect(() => {
    function handleclickoutside(event) {

      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setemojiPickerOpenClose(false)
      }
    }
    document.addEventListener("mousedown", handleclickoutside)
    return () => {
      document.removeEventListener("mousedown", handleclickoutside)
    }
  }, [emojiRef])


  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 '>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
        <input
          type='text'
          placeholder='Enter Message'
          className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none '
          value={message}
          onChange={(e) => setmessage(e.target.value)}
        />
        <button onClick={hadleVoiceNotek} className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
          <MdKeyboardVoice className='text-2xl'/>
        </button>
        <button onClick={hadleFileInputclick} className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' >
          <GrAttachment className='text-2xl' />
        </button>
        <input type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAttachementChange} 
            />
        <div className='relative'>
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={() => setemojiPickerOpenClose(true)}
          >
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          <div className='absolute bottom-16 right-0 ' ref={emojiRef}>
            <EmojiPicker
              theme='dark'
              open={emojiPickerOpenClose}
              onEmojiClick={HandleEmojiPicker}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button className='bg-[#8412ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' >
        <IoSend className='text-2xl'
          onClick={HandlesendMessage}
        />
      </button>
    </div>
  )
}

export default MessageBar