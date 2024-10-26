import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./Components/ChatContainer";
import EmptyChatContainer from "./Components/EmptyChatContainer";
import ContactsContainer from "./Components/ContactsContainer";

const Chat = () => {

  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!userInfo.profilesetup){
      toast("please set up use profile to continue to chat");
      navigate('/profile')
    }
  }, [userInfo, navigate])
  
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
        <ContactsContainer/>
        {/* <EmptyChatContainer/> */}
      <ChatContainer/>
      
    </div>
  )
}

export default Chat