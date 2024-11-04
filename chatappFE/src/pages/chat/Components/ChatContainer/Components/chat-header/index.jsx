import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { HOST } from '@/utils/constants'
import { IoReturnDownBack } from "react-icons/io5";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  const handleBlockUser = async () => {}
  const handleUnBlockUser = async () => {}
  const handleDeleteAllChat = async () => {}

  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center px-20 justify-between'>
      {/* Left side content */}
      <div className='flex gap-5 items-center'>
        <button onClick={closeChat}>
          <IoReturnDownBack className='text-4xl' />
        </button>
        <div className='w-12 h-12 relative top-[5px]'>
          {selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className={`uppercase h-12 w-12 flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                  {selectedChatData.firstname
                    ? selectedChatData.firstname.charAt(0)
                    : selectedChatData.email.charAt(0)}
                </div>
              )}
            </Avatar>
          ) : (
            <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>
          )}
        </div>
        <div>
          {selectedChatType === "channel" && selectedChatData.name}
          {selectedChatType === "contact" && selectedChatData.firstname
            ? `${selectedChatData.firstname} ${selectedChatData.lastname}`
            : selectedChatData.email}
        </div>
      </div>

      {/* Right side buttons */}
      <div className='flex gap-5'>
        <button
          className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
          onClick={handleBlockUser}
        >
          Block User
        </button>
        <button
          className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
          onClick={handleUnBlockUser}
        >
          Unblock User
        </button>
        <button
          className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
          onClick={handleDeleteAllChat}
        >
          Delete all chat
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
