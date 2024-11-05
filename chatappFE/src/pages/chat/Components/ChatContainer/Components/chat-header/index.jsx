import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { HOST } from '@/utils/constants'
import { IoReturnDownBack } from "react-icons/io5";
import { apiClient } from '@/lib/api-client'
import { BLOCK_USER , UN_BLOCK, USER_INFO} from '@/utils/constants'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'


const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType,userInfo , setuserInfo } = useAppStore();
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Check if the selected user is in the blockedUsers list
    if (selectedChatType === "contact" && userInfo?.blockedUsers.includes(selectedChatData._id)) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [userInfo, selectedChatData, selectedChatType]);

const handleToggleBlockUser = async () => {
  try {
    const userId = userInfo.id;
    const blockedUserId = selectedChatData._id;
    const action = isBlocked ? UN_BLOCK : BLOCK_USER;

    const response = await apiClient.post(action, { userId, blockedUserId });
    if (response.status === 200) {
      // Update userInfo to reflect the new block/unblock status
      const updatedUserInfo = await apiClient.get(USER_INFO);
      setuserInfo(updatedUserInfo.data);

      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
    } else {
      toast.error(`Failed to ${isBlocked ? "unblock" : "block"} the user`);
    }
  } catch (error) {
    console.log(`Error ${isBlocked ? "unblocking" : "blocking"} user:`, error.message);
    toast.error(`Error ${isBlocked ? "unblocking" : "blocking"} the user`);
  }
};

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
          onClick={handleToggleBlockUser}
        >
         {isBlocked ? "Unblock User" : "Block User"}
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
