import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./Components/ChatContainer";
import EmptyChatContainer from "./Components/EmptyChatContainer";
import ContactsContainer from "./Components/ContactsContainer";

const Chat = () => {

  const {userInfo, selectedChatType , isUploading,
    isDownloading ,
    UploadingProgress,
    DownloadingProgress} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!userInfo.profilesetup){
      toast("please set up use profile to continue to chat");
      navigate('/profile')
    }
  }, [userInfo, navigate])
  
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {
        isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg  ">
         <h5 className="text-5xl animate-pulse "> uploading file  </h5>
          {UploadingProgress}%
          </div>
      }

{
        isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg  ">
         <h5 className="text-5xl animate-pulse "> Downloading file  </h5>
          {DownloadingProgress}%
          </div>
      }
        <ContactsContainer/>
        {
          selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>
        }
        
      
    </div>
  )
}

export default Chat