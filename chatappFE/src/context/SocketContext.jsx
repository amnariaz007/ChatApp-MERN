import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useEffect, useContext, useRef} from "react";
import {io} from 'socket.io-client'

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) =>{
    const socket = useRef();
    const {userInfo} = useAppStore();

    useEffect(() => {
     if(userInfo){
        socket.current = io(HOST,{
            withCredetials: true,
            query: { userId: userInfo.id}
        });
        socket.current.on("connect", ()=>{
            console.log("conected to socket server");
        });

        return () =>{
            socket.current.disconnect();
        }
     }
    }, [userInfo])

    return(
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
    
}