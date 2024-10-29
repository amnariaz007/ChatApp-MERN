import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useSocket } from '@/context/SocketContext'
import { useAppStore } from '@/store'



const MessageBar = () => {

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
    if (socket?.connected) {
      socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined
      });
      setmessage("")
  } else {
      console.error("Socket not connected or initialized.");
  }
  
  };
  


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
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' >
          <GrAttachment className='text-2xl' />
        </button>
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