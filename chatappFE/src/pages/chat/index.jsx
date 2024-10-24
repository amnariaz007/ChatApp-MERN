import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    <div>Chat</div>
  )
}

export default Chat